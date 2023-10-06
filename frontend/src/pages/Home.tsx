import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { ColumnList, Search, type ListItem, Table } from "../components";
import {
  familyIdProp,
  type Family,
  reportReceiveProp,
  reportDateProp,
  familyReceiptHistoryHeaders,
} from "../modules";
import {
  getAllFamilies,
  getFamilyReceiptHistory,
  searchFamilies,
} from "../services";
import { formatDate } from "../util";

function Home() {
  const families = useAllFamilies();
  const [selectedFamily, setSelectedFamily] = useState("");
  const familyReceiptHistory = useFamilyReceiptHistory(selectedFamily);

  return (
    <main className="m-5 text-center">
      <Row className="mb-5">
        <h1 style={{ fontSize: "54px" }}>גמ"ח אבישי - ישיבת קרית שמונה</h1>
      </Row>
      <Row>
        <Col sm="5">
          <QueryDisplay columnList={families} setSelected={setSelectedFamily} />
        </Col>
        <Col sm="6" className="my-3">
          {selectedFamily ? (
            <>
              <h3 className="mb-4">מידע על משפחת {selectedFamily}</h3>
              {familyReceiptHistory.length > 0 ? (
                <Table
                  columnMapper={{
                    [reportReceiveProp]: (received) => {
                      let background = undefined;
                      if (received === true) {
                        background = "received";
                      } else if (received === false) {
                        background = "not-received";
                      }
                      return { background };
                    },
                    [reportDateProp]: (date) => {
                      return { text: formatDate(date) };
                    },
                  }}
                  columns={familyReceiptHistoryHeaders}
                  data={familyReceiptHistory}
                  dataIdProp="חודש"
                />
              ) : (
                <h4 className="mt-5">משפחה זו לא נמצאת בדוחות הקבלה שבמערכת</h4>
              )}
            </>
          ) : (
            <h3>לא נמצאה משפחה מתאימה</h3>
          )}
        </Col>
      </Row>
    </main>
  );
}

interface QueryDisplayProps {
  columnList: ListItem[];
  setSelected: (selected: string) => void;
}

function QueryDisplay({ columnList, setSelected }: QueryDisplayProps) {
  const [query, setQuery] = useState("");
  const searchResult = columnList.filter((item) => item.includes(query));

  return (
    <div className="mx-5">
      <Search onChange={setQuery} placeholder="הכנס שם משפחה..." />
      <ColumnList list={searchResult} onItemSelect={setSelected} />
    </div>
  );
}

function useAllFamilies() {
  const [families, setFamilies] = useState<string[]>([]);

  useEffect(() => {
    getAllFamilies().then((allFamilies) => {
      const familiesNames = allFamilies.map((family) => family[familyIdProp]);
      setFamilies(familiesNames);
    });
  }, []);

  return families;
}

function useFamilyReceiptHistory(familyName: string) {
  const [receiptHistory, setReceiptHistory] = useState([]);

  useEffect(() => {
    if (!familyName) return;

    getFamilyReceiptHistory(familyName).then((res) =>
      setReceiptHistory(res.data.statuses)
    );
  }, [familyName]);

  return receiptHistory;
}

export default Home;
