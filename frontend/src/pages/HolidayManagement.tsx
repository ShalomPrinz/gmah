import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getSearchBy, NoHolidays, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import { useHolidayContext } from "../contexts";
import {
  type HolidaySelectFamily,
  familyIdProp,
  holidayFamiliesSelectionTableHeaders,
} from "../modules";
import { getHolidayStatus, updateHolidayStatus } from "../services";

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
  const { hasHolidays, selectedHoliday } = useHolidayContext();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const { holidayHasFamilies, searchResult, selectedFamilies } =
    useHolidayFamilies(query, searchBy, selectedHoliday);
  const resultHasFamilies = searchResult.length > 0;

  const {
    removeFromSelection,
    selectFamily,
    selectManyFamilies,
    selectedList,
  } = useHolidaySelection(selectedFamilies);
  const hasSelectedFamilies = selectedList.length > 0;

  function saveFamiliesSelection() {
    const selectedFamilies = selectedList.map((family) => family[familyIdProp]);
    updateHolidayStatus(selectedHoliday, selectedFamilies)
      .then(() => toast.success("השינויים נשמרו בהצלחה"))
      .catch(() => toast.error("קרתה שגיאה בשמירת השינויים"));
  }

  if (!hasHolidays) return <NoHolidays pageTitle={pageTitle} />;

  return (
    <>
      <main className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <Row className="mx-5">
          <Col className="text-center ps-5" sm="8">
            <SearchRow
              marginBottom="1"
              onQueryChange={(q: string) => setQuery(q)}
              onSearchByChange={(value: string) => setSearchBy(value)}
              queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
              searchBy={buttons}
            />
            {searchResult.length === 0 ? (
              <></>
            ) : (
              <button
                className="mb-3 p-2 rounded bg-default fs-5"
                onClick={() => selectManyFamilies(searchResult)}
                type="button"
              >
                הוסף את {searchResult.length} המשפחות שתואמות את החיפוש
              </button>
            )}
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

  function selectFamily(family: HolidaySelectFamily) {
    if (selectedList.findIndex((f) => isSameFamily(f, family)) !== -1) {
      toast.warn(
        `המשפחה ${family[familyIdProp]} כבר נמצאת בנתמכים הנוספים לחג`,
        {
          toastId: family[familyIdProp],
        }
      );
      return;
    }

    setSelectedList((prev) => [...prev, family]);
  }

  function selectManyFamilies(families: HolidaySelectFamily[]) {
    families.forEach(selectFamily);
  }

  function removeFromSelection(family: HolidaySelectFamily) {
    setSelectedList((prev) => prev.filter((f) => !isSameFamily(f, family)));
  }

  return {
    selectFamily,
    selectManyFamilies,
    selectedList,
    removeFromSelection,
  };
}

export default HolidayManagement;
