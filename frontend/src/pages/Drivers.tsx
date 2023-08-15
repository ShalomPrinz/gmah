import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { ColumnList, type ListItem, Search, Table } from "../components";
import IconComponent from "../components/Icon";
import { type Family, familyIdProp, reportCompletionBuilder } from "../modules";
import {
  getDriverFamilies,
  getDriverlessFamilies,
  getDrivers,
  removeFamilyDriver,
  updateDriverName,
} from "../services";

function Drivers() {
  const { drivers, driversChanged } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState("");
  const { driverFamilies, driverlessFamilies, familiesChanged } =
    useFamilies(selectedDriver);

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

  function removeFamilyDriverFunc(family: Family) {
    removeFamilyDriver(family[familyIdProp]).then(familiesChanged);
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
            <div className="text-center">
              <Table
                columns={reportCompletionBuilder}
                data={driverFamilies}
                dataIdProp={familyIdProp}
                LastColumn={RemoveButton(removeFamilyDriverFunc)}
                numberedTable
              />
            </div>
          </Col>
          <Col sm="3">
            <div className="text-center">
              {driverlessFamilies.length > 0 ? (
                <Table
                  columns={reportCompletionBuilder}
                  data={driverlessFamilies}
                  dataIdProp={familyIdProp}
                />
              ) : (
                <h3 className="fw-light mt-4">- אין משפחות ללא נהג -</h3>
              )}
            </div>
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

function RemoveButton(remove: (item: any) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="bg-white text-danger rounded border border-3 border-danger button-hover"
      onClick={() => remove(item)}
      type="button"
    >
      <span className="ps-2">הסר</span>
      <IconComponent color="red" icon="removeItem" />
    </button>
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

function useDriverFamilies(driverName: string, reloadKey: number) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!driverName) return;

    getDriverFamilies(driverName)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driver families",
          error
        )
      );
  }, [driverName, reloadKey]);

  return families;
}

function useDriverlessFamilies(reloadKey: number) {
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
  }, [reloadKey]);

  return families;
}

function useFamilies(driverName: string) {
  const [reloadKey, setReloadKey] = useState(0);
  const driverFamilies = useDriverFamilies(driverName, reloadKey);
  const driverlessFamilies = useDriverlessFamilies(reloadKey);

  function familiesChanged() {
    setReloadKey((prev) => prev + 1);
  }

  return {
    driverFamilies,
    driverlessFamilies,
    familiesChanged,
  };
}

export default Drivers;
