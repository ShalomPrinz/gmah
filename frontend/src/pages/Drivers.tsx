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
import {
  getDriverFamilies,
  getDriverlessFamilies,
  getDrivers,
  updateDriverName,
} from "../services";

function Drivers() {
  const { drivers, driversChanged } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState("");
  const families = useDriverFamilies(selectedDriver);
  const driverlessFamilies = useDriverlessFamilies();

  function onDriverSubmit(originalName: string, newName: string) {
    updateDriverName(originalName, newName)
      .then(() => {
        const toastId = `${originalName}${newName}`;
        toast.success(`שינית את שם הנהג ${originalName} ל${newName} בהצלחה`, {
          toastId: `${toastId}-success`,
        });
        toast.info(
          "שים לב שמספר הטלפון של הנהג לא השתנה, באפשרותך לשנות אותו בעמוד של אחראי הנהגים",
          { toastId: `${toastId}-info` }
        );
        driversChanged();
      })
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
          <Col sm="4">
            <QueryDisplay
              columnList={drivers}
              setSelected={setSelectedDriver}
            />
          </Col>
          <Col sm="5">
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
          <Col sm="3">
            {driverlessFamilies.length > 0 ? (
              <ConditionalList
                itemCallback={familyCallback}
                list={driverlessFamilies}
                keyProp={familyIdProp}
              />
            ) : (
              <h3 className="fw-light mt-4">- אין משפחות ללא נהג -</h3>
            )}
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
      <Search onChange={setQuery} placeholder="הכנס נהג..." />
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
  const [reloadKey, setReloadKey] = useState(0);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    getDrivers()
      .then((res) => setDrivers(res.data.drivers))
      .catch((error) =>
        console.error("Error occurred while trying to get all drivers", error)
      );
  }, [reloadKey]);

  function driversChanged() {
    setReloadKey((prev) => prev + 1);
  }

  return { drivers, driversChanged };
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

function useDriverlessFamilies() {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    getDriverlessFamilies()
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driverless families",
          error
        )
      );
  });

  return families;
}

export default Drivers;
