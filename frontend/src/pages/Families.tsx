import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { RadioMenu, Table } from "../components";
import Search from "../components/Search";
import { searchFamilies } from "../services";

const columns = [
  {
    id: 0,
    label: "שם מלא",
    path: "fullName",
  },
  {
    id: 1,
    label: "רחוב",
    path: "street",
  },
  {
    id: 2,
    label: "בניין",
    path: "house",
  },
  {
    id: 3,
    label: "דירה",
    path: "apartmentNumber",
  },
  {
    id: 4,
    label: "קומה",
    path: "floor",
  },
  {
    id: 5,
    label: "מס' בית",
    path: "homePhone",
  },
  {
    id: 6,
    label: "מס' פלאפון",
    path: "mobilePhone",
  },
  {
    id: 7,
    label: "נהג במקור",
    path: "originalDriver",
  },
  {
    id: 8,
    label: "ממליץ",
    path: "referrer",
  },
  {
    id: 9,
    label: "הערות",
    path: "notes",
  },
];

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
];

const getButtonTextByValue = (value: string) =>
  buttons.find((b) => b.value === value)?.text || buttons[0].text;

const getHeaderByButtonValue = (value: string) =>
  ({
    name: "שם מלא",
    street: "רחוב",
    phone: "מס' פלאפון",
  }[value] || "NoSuchSearchOption");

function Families() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const families = useFamiliesSearch(query, searchBy);

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
          columns={columns}
          data={families}
          dataIdProp="fullName"
          headerHighlight={getHeaderByButtonValue(searchBy)}
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
