import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import {
  type HolidaySelectFamily,
  familyIdProp,
  holidayFamiliesSelectionTableHeaders,
} from "../modules";
import { searchHolidayFamilies, startNewHoliday } from "../services";

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

function NewHoliday() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const titleRef = useRef<HTMLInputElement>(null);

  const { holidayHasFamilies, searchResult } = useHolidayFamilies(
    query,
    searchBy
  );
  const resultHasFamilies = searchResult.length > 0;

  const { removeFromSelection, selectFamily, selectedList } =
    useHolidaySelection();
  const hasSelectedFamilies = selectedList.length > 0;

  function generateHoliday() {
    const title = titleRef.current?.value;
    if (typeof title === "undefined") {
      toast.warn("לא ניתן לפתוח חג חדש ללא שם החג", {
        toastId: "holidayNameMissingError",
      });
      return;
    }

    const families = selectedList.map((family) => family[familyIdProp]);
    startNewHoliday(title, families)
      .then(() => toast.success(`יצרת חג חדש בשם ${title} בהצלחה`))
      .catch(() => toast.error("קרתה שגיאה בלתי צפויה"));
  }

  return (
    <>
      <main className="text-center">
        <h1 className="mt-5 mb-4">פתיחת חג חדש</h1>
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
              <label className="fs-3 ps-4">כותרת:</label>
              <input
                className="fs-4 mb-4 p-2 rounded form-text-input"
                placeholder="הכנס שם חג..."
                ref={titleRef}
                type="text"
              />
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
        className="fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={generateHoliday}
        type="button"
      >
        <span className="ps-3">סיום הבחירה</span>
        <IconComponent icon="createPdf" />
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

function useHolidayFamilies(query: string, searchBy: string) {
  const [families, setFamilies] = useState([]);
  const filtered = families.filter((family) => {
    const key = getSearchByHeader(searchBy);
    const familyKey = String(family[key] ?? "");
    return familyKey.includes(query);
  });

  useEffect(() => {
    searchHolidayFamilies("", "")
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get report completions",
          error
        )
      );
  }, []);

  return { holidayHasFamilies: families.length > 0, searchResult: filtered };
}

function useHolidaySelection() {
  const [selectedList, setSelectedList] = useState<HolidaySelectFamily[]>([]);

  const isSameFamily = (
    first: HolidaySelectFamily,
    second: HolidaySelectFamily
  ) => first[familyIdProp] === second[familyIdProp];

  function selectFamily(item: HolidaySelectFamily) {
    if (selectedList.findIndex((f) => isSameFamily(f, item)) !== -1) {
      toast.warn(`המשפחה ${item[familyIdProp]} כבר נמצאת ברשימת ההשלמות`, {
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

export default NewHoliday;
