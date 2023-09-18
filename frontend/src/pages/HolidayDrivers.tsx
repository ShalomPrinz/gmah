import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import {
  ColumnList,
  type ListItem,
  Search,
  Table,
  NoHolidays,
} from "../components";
import IconComponent from "../components/Icon";
import { useHolidayContext } from "../contexts";
import { useReloadKey } from "../hooks";
import { type Family, familyIdProp, reportCompletionBuilder } from "../modules";
import {
  addHolidayDriver,
  getHolidayDriverFamilies,
  getHolidayDriverlessFamilies,
  getHolidayDrivers,
  removeHolidayDriver,
} from "../services";

const pageTitle = "נהגים לחג";
function HolidayDrivers() {
  const { hasHolidays, selectedHoliday } = useHolidayContext();
  const { addLocalDriver, drivers } = useDrivers(selectedHoliday);
  const [selectedDriver, setSelectedDriver] = useState("");
  const { driverFamilies, driverlessFamilies, familiesChanged } = useFamilies(
    selectedHoliday,
    selectedDriver
  );

  if (!hasHolidays) return <NoHolidays pageTitle={pageTitle} />;

  function removeFamilyDriverFunc(family: Family) {
    removeHolidayDriver(selectedHoliday, family[familyIdProp]).then(
      familiesChanged
    );
  }

  function addFamilyDriverFunc(family: Family) {
    addHolidayDriver(
      selectedHoliday,
      family[familyIdProp],
      selectedDriver
    ).then(familiesChanged);
  }

  return (
    <>
      <h1 className="mt-5 mb-4 text-center">{pageTitle}</h1>
      <main className="container">
        <Row>
          <Col sm="4">
            <NewDriverInput addDriver={addLocalDriver} />
            <QueryDisplay
              columnList={drivers}
              setSelected={setSelectedDriver}
            />
          </Col>
          <Col sm="4">
            <div className="text-center">
              <h3 className="mt-4 mb-3">{selectedDriver}</h3>
              {driverFamilies.length > 0 ? (
                <Table
                  columns={reportCompletionBuilder}
                  data={driverFamilies}
                  dataIdProp={familyIdProp}
                  LastColumn={RemoveButton(removeFamilyDriverFunc)}
                  numberedTable
                />
              ) : (
                <h4 className="fw-light mt-4">- לנהג זה אין משפחות -</h4>
              )}
            </div>
          </Col>
          <Col sm="4">
            <div className="text-center">
              {driverlessFamilies.length > 0 ? (
                <>
                  <h3 className="mt-4 mb-3">משפחות ללא נהג</h3>
                  <Table
                    columns={reportCompletionBuilder}
                    data={driverlessFamilies}
                    dataIdProp={familyIdProp}
                    LastColumn={AddButton(addFamilyDriverFunc)}
                    numberedTable
                  />
                </>
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

interface NewDriverInputProps {
  addDriver: (driver: string) => void;
}

function NewDriverInput({ addDriver }: NewDriverInputProps) {
  const newDriverRef = useRef<HTMLInputElement>(null);

  function addDriverFunc() {
    if (newDriverRef?.current?.value) {
      addDriver(newDriverRef.current.value);
      newDriverRef.current.value = "";
    }
  }

  return (
    <div className="text-center">
      <input
        className="fs-5 text-center form-text-input p-1 mx-2 border border-3 border-primary"
        ref={newDriverRef}
        style={{ width: "40%" }}
        title="שם הנהג"
        type="text"
      />
      <button
        className="bg-success text-white rounded px-3 py-1 fs-5"
        onClick={addDriverFunc}
        type="button"
      >
        הוסף נהג
      </button>
    </div>
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

function AddButton(add: (item: any) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="bg-white text-primary rounded border border-3 border-primary button-hover"
      onClick={() => add(item)}
      type="button"
    >
      <span className="ps-2">הוסף</span>
      <IconComponent color="blue" icon="addFamily" />
    </button>
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

function useDrivers(holidayName: string) {
  const [drivers, setDrivers] = useState<string[]>([]);

  useEffect(() => {
    if (!holidayName) return;

    getHolidayDrivers(holidayName)
      .then((res) => setDrivers(res.data.drivers))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get all holiday drivers",
          error
        )
      );
  }, [holidayName]);

  function addLocalDriver(driver: string) {
    setDrivers((prev) => [driver, ...prev]);
  }

  return { addLocalDriver, drivers };
}

function useDriverFamilies(
  holidayName: string,
  driverName: string,
  reloadKey: number
) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!holidayName || !driverName) return;

    getHolidayDriverFamilies(holidayName, driverName)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driver families",
          error
        )
      );
  }, [holidayName, driverName, reloadKey]);

  return families;
}

function useDriverlessFamilies(holidayName: string, reloadKey: number) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!holidayName) return;

    getHolidayDriverlessFamilies(holidayName)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driverless families",
          error
        )
      );
  }, [holidayName, reloadKey]);

  return families;
}

function useFamilies(holidayName: string, driverName: string) {
  const { reloadKey, updateKey } = useReloadKey();
  const driverFamilies = useDriverFamilies(holidayName, driverName, reloadKey);
  const driverlessFamilies = useDriverlessFamilies(holidayName, reloadKey);

  return {
    driverFamilies,
    driverlessFamilies,
    familiesChanged: updateKey,
  };
}

export default HolidayDrivers;
