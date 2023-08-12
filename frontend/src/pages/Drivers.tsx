import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import {
  ColumnList,
  ConditionalList,
  type ListItem,
  Search,
} from "../components";
import { type Family, familyIdProp } from "../modules";
import { getDriverFamilies, getDrivers, updateDriverName } from "../services";

function Drivers() {
  const drivers = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState("");
  const families = useDriverFamilies(selectedDriver);

  function onDriverSubmit(originalName: string, newName: string) {
    updateDriverName(originalName, newName)
      .then(() =>
        toast.success(`שינית את שם הנהג ${originalName} ל${newName} בהצלחה`)
      )
      .catch(() => toast.error("קרתה שגיאה לא צפויה"));
  }

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
            <DriverInput
              defaultName={selectedDriver}
              key={selectedDriver}
              onSubmit={onDriverSubmit}
            />
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

interface DriverInputProps {
  defaultName: string;
  onSubmit: (originalName: string, newName: string) => void;
}

function DriverInput({ defaultName, onSubmit }: DriverInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        className="fs-2 w-50 ms-5 mb-4 text-center form-text-input border border-3 border-primary"
        defaultValue={defaultName}
        ref={inputRef}
        title="שם הנהג"
        type="text"
      />
      <button
        className="bg-default rounded p-3 fs-4"
        onClick={() => onSubmit(defaultName, inputRef.current?.value ?? "")}
        type="button"
      >
        עדכון
      </button>
    </>
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
