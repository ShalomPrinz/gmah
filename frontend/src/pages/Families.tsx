import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

import { RadioMenu, Table } from "../components";
import IconComponent from "../components/Icon";
import Search from "../components/Search";
import { familiesTableHeaders } from "../modules";
import { searchFamilies } from "../services";

const familyIdProp = "שם מלא";

const buttons = [
  {
    id: "search-by-name",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-street",
    text: "רחוב",
    value: "street",
  },
  {
    id: "search-by-phone",
    text: "מספר פלאפון",
    value: "phone",
  },
  {
    id: "search-by-driver",
    text: "נהג",
    value: "driver",
  },
];

const getButtonTextByValue = (value: string) =>
  buttons.find((b) => b.value === value)?.text || buttons[0].text;

const getHeaderByButtonValue = (value: string) =>
  ({
    name: "שם מלא",
    street: "רחוב",
    phone: "מס' פלאפון",
    driver: "נהג",
  }[value] || "NoSuchSearchOption");

function Families() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const families = useFamiliesSearch(query, searchBy);

  const LastTableColumn = ({ item }: { item: any }) => (
    <Link
      className="link-decoration rounded fs-5 p-2"
      to={`edit/${item[familyIdProp]}`}
      state={{ item }}
    >
      <span className="ps-2">עריכה</span>
      <IconComponent icon="editFamily" />
    </Link>
  );

  return (
    <main className="container text-center mx-auto">
      <Row>
        <h1 className="mt-5 mb-4">חיפוש משפחות</h1>
      </Row>
      <Row className="mb-3">
        <Col sm="3">
          <h2>חפש באמצעות:</h2>
          <RadioMenu
            buttons={buttons}
            menuId="search-by"
            onSelect={(value: string) => setSearchBy(value)}
          />
        </Col>
        <Col>
          <Search
            onChange={(q: string) => setQuery(q)}
            placeholder={`הכנס ${getButtonTextByValue(searchBy)} של משפחה...`}
          />
        </Col>
        <Col sm="3">
          <h2>מספר תוצאות</h2>
          <p className="text-primary" style={{ fontSize: "50px" }}>
            {families.length}
          </p>
        </Col>
      </Row>
      <Row>
        <Table
          columns={familiesTableHeaders}
          data={families}
          dataIdProp={familyIdProp}
          headerHighlight={getHeaderByButtonValue(searchBy)}
          LastColumn={LastTableColumn}
        />
      </Row>
    </main>
  );
}

function useFamiliesSearch(query: string, searchBy: string) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    searchFamilies(query, searchBy)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query, searchBy]);

  return families;
}

export default Families;
