import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from "react-toastify";

import { RadioMenu, Search, Table } from "../components";
import IconComponent from "../components/Icon";
import { familiesHistoryTableHeaders, familyIdProp } from "../modules";
import type { Family } from "../modules";
import { restoreFamily, searchFamiliesHistory } from "../services";

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

async function restoreFamilyWrapper(
  familyName: string,
  onRestoreSuccess: () => void
) {
  return restoreFamily(familyName)
    .then(() => {
      toast.success(`שחזרת את משפחת ${familyName} מהסטוריית הנתמכים`, {
        toastId: `restoreSuccess:${familyName}`,
      });
      onRestoreSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו לשחזר את המשפחה ${familyName} מהסטוריית הנתמכים: ${response.data.description}`,
        {
          toastId: `restoreFailure:${familyName}`,
        }
      );
    });
}

function FamiliesHistory() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families, reloadFamilies } = useFamiliesSearch(query, searchBy);

  const RestoreFamily = ({ item }: { item: any }) => (
    <button
      className="fs-5 p-2 rounded bg-success text-white border border-none border-0"
      onClick={() => restoreFamilyWrapper(item[familyIdProp], reloadFamilies)}
      type="button"
    >
      <span className="ps-2">שחזור</span>
      <IconComponent flipHorizontal icon="restoreItem" />
    </button>
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
          columns={familiesHistoryTableHeaders}
          data={families}
          dataIdProp={familyIdProp}
          headerHighlight={getHeaderByButtonValue(searchBy)}
          LastColumn={RestoreFamily}
        />
      </Row>
    </main>
  );
}

function useFamiliesSearch(query: string, searchBy: string) {
  const [families, setFamilies] = useState<Family[]>([]);

  const [searchKey, setSearchKey] = useState(0);
  const reloadFamilies = () => setSearchKey((prev) => prev + 1);

  useEffect(() => {
    searchFamiliesHistory(query, searchBy)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query, searchBy, searchKey]);

  return { families, reloadFamilies };
}

export default FamiliesHistory;
