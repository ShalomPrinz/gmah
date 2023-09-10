import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Dropdown, getSearchBy, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import {
  type HolidaySelectFamily,
  familyIdProp,
  holidayFamiliesSelectionTableHeaders,
} from "../modules";
import {
  getHolidaysList,
  getHolidayStatus,
  updateHolidayStatus,
} from "../services";

const buttons = [
  {
    id: "search-by-name",
    header: "שם מלא",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-r11r",
    text: "ממליץ",
    value: "r11r",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

const defaultHoliday = "";
const pageTitle = "ניהול חג";

function HolidayManagement() {
  const { HolidaysDropdown, selectedHoliday } = useHolidays();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const { holidayHasFamilies, searchResult, selectedFamilies } =
    useHolidayFamilies(query, searchBy, selectedHoliday);
  const resultHasFamilies = searchResult.length > 0;

  const { removeFromSelection, selectFamily, selectedList } =
    useHolidaySelection(selectedFamilies);
  const hasSelectedFamilies = selectedList.length > 0;

  function saveFamiliesSelection() {
    const selectedFamilies = selectedList.map((family) => family[familyIdProp]);
    updateHolidayStatus(selectedHoliday, selectedFamilies)
      .then(() => toast.success("השינויים נשמרו בהצלחה"))
      .catch(() => toast.error("קרתה שגיאה בשמירת השינויים"));
  }

  if (selectedHoliday === defaultHoliday) {
    return (
      <div className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <h3>
          אין חגים במערכת. באפשרותך
          <Link
            className="link-decoration rounded fs-5 p-3 me-2 fs-3"
            to="/holidays/new"
          >
            לייצר חג חדש
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <>
      <main className="text-center">
        <div className="d-flex justify-content-center align-items-center">
          <h1 className="my-5">{pageTitle}</h1>
          <div className="me-4">{HolidaysDropdown}</div>
        </div>
        <Row className="mx-5">
          <Col className="text-center ps-5" sm="8">
            <SearchRow
              onQueryChange={(q: string) => setQuery(q)}
              onSearchByChange={(value: string) => setSearchBy(value)}
              queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
              searchBy={buttons}
            />
            <Row className="mx-5">
              {holidayHasFamilies ? (
                resultHasFamilies ? (
                  <Table
                    columns={holidayFamiliesSelectionTableHeaders}
                    data={searchResult}
                    dataIdProp={familyIdProp}
                    headerHighlight={getSearchByHeader(searchBy)}
                    LastColumn={SelectionAddButton(selectFamily)}
                  />
                ) : (
                  <h2 className="fw-light my-5">
                    לא נמצאו משפחות לחגים שתואמות את החיפוש
                  </h2>
                )
              ) : (
                <h2 className="fw-light my-5">
                  אין משפחות מיוחדות לחגים במערכת
                </h2>
              )}
            </Row>
          </Col>
          <Col sm="4" style={{ marginBottom: "150px" }}>
            <>
              {hasSelectedFamilies ? (
                <Table
                  columns={holidayFamiliesSelectionTableHeaders}
                  data={selectedList}
                  dataIdProp={familyIdProp}
                  LastColumn={SelectionRemoveButton(removeFromSelection)}
                  numberedTable
                />
              ) : (
                <h5 className="fw-light my-5">
                  - לא נבחרו משפחות נוספות לחג -
                </h5>
              )}
            </>
          </Col>
        </Row>
      </main>
      <button
        className="fs-3 bg-default rounded p-4 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={saveFamiliesSelection}
        type="button"
      >
        <span className="ps-3">שמור שינויים</span>
        <IconComponent icon="saveChanges" />
      </button>
    </>
  );
}

function SelectionAddButton(add: (item: any) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="fs-5 p-2 rounded bg-default border border-none border-0"
      onClick={() => add(item)}
      type="button"
    >
      <span className="ps-2">הוסף</span>
      <IconComponent icon="addFamily" />
    </button>
  );
}

function SelectionRemoveButton(remove: (item: any) => void) {
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

function useHolidayFamilies(
  query: string,
  searchBy: string,
  holidayName: string
) {
  const [families, setFamilies] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);

  const filtered = families.filter((family) => {
    const key = getSearchByHeader(searchBy);
    const familyKey = String(family[key] ?? "");
    return familyKey.includes(query);
  });

  useEffect(() => {
    if (!holidayName) return;

    getHolidayStatus(holidayName)
      .then((res) => {
        setFamilies(res.data.status.extra);
        setSelectedFamilies(res.data.status.added);
      })
      .catch((error) =>
        console.error(
          "Error occurred while trying to get holiday extra families status",
          error
        )
      );
  }, [holidayName]);

  return {
    holidayHasFamilies: families.length > 0,
    searchResult: filtered,
    selectedFamilies,
  };
}

function useHolidaySelection(initialSelectedList: HolidaySelectFamily[]) {
  const [selectedList, setSelectedList] =
    useState<HolidaySelectFamily[]>(initialSelectedList);

  useEffect(() => {
    setSelectedList(initialSelectedList);
  }, [initialSelectedList.length]);

  const isSameFamily = (
    first: HolidaySelectFamily,
    second: HolidaySelectFamily
  ) => first[familyIdProp] === second[familyIdProp];

  function selectFamily(item: HolidaySelectFamily) {
    if (selectedList.findIndex((f) => isSameFamily(f, item)) !== -1) {
      toast.warn(`המשפחה ${item[familyIdProp]} כבר נמצאת בנתמכים הנוספים לחג`, {
        toastId: item[familyIdProp],
      });
      return;
    }

    setSelectedList((prev) => [...prev, item]);
  }

  function removeFromSelection(item: HolidaySelectFamily) {
    setSelectedList((prev) => prev.filter((f) => !isSameFamily(f, item)));
  }

  return {
    selectFamily,
    selectedList,
    removeFromSelection,
  };
}

function useHolidays() {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    getHolidaysList()
      .then((res) => setHolidays(res.data.holidays))
      .catch(() =>
        console.error("Error occurred while trying to get holidays list")
      );
  }, []);

  return useHolidaysDropdown(holidays);
}

function useHolidaysDropdown(holidays: string[]) {
  const [selected, setSelected] = useState("0");
  const onSelect = (eventKey: string | null) => {
    if (eventKey) setSelected(eventKey);
  };

  const options = holidays.map((name, index) => ({
    eventKey: index.toString(),
    value: name,
  }));

  const selectedHoliday =
    options.find(({ eventKey }) => selected === eventKey)?.value ??
    defaultHoliday;

  const HolidaysDropdown = (
    <Dropdown onSelect={onSelect} options={options} title={selectedHoliday} />
  );

  return { HolidaysDropdown, selectedHoliday };
}

export default HolidayManagement;