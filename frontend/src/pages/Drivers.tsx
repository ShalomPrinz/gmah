import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {
  ColumnList,
  ConditionalList,
  type ListItem,
  Search,
} from "../components";
import { type Family, familyIdProp } from "../modules";
import { getDriverFamilies, getDrivers } from "../services";

function Drivers() {
  const drivers = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState("");
  const families = useDriverFamilies(selectedDriver);

  function familyCallback(family: Family) {
    return <h5>{family[familyIdProp]}</h5>;
  }

  return (
    <>
      <h1 className="my-5 text-center">נהגים</h1>
      <main className="container">
        <Row>
          <Col>
            <QueryDisplay
              columnList={drivers}
              setSelected={setSelectedDriver}
            />
          </Col>
          <Col>
            <h2 className="fw-bold mb-4">{selectedDriver}</h2>
            <ConditionalList
              itemCallback={familyCallback}
              list={families}
              keyProp={familyIdProp}
            />
          </Col>
        </Row>
      </main>
    </>
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
      <Search onChange={setQuery} placeholder="הכנס נהג של משפחה..." />
      <ColumnList list={searchResult} onItemSelect={setSelected} />
    </div>
  );
}

function useDrivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    getDrivers()
      .then((res) => setDrivers(res.data.drivers))
      .catch((error) =>
        console.error("Error occurred while trying to get all drivers", error)
      );
  }, []);

  return drivers;
}

function useDriverFamilies(driverName: string) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    getDriverFamilies(driverName)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driver families",
          error
        )
      );
  }, [driverName]);

  return families;
}

export default Drivers;
