import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { NoHolidays, SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import { useHolidayContext } from "../contexts";
import {
  CompletionFamily,
  familyIdProp,
  holidayFamiliesSelectionTableHeaders,
} from "../modules";
import {
  createCompletionHolidayPrintable,
  getHolidayRegularFamilies,
  getHolidayStatus,
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

const pageTitle = "השלמות לחג";
function HolidayCompletion() {
  const { hasHolidays, selectedHoliday } = useHolidayContext();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const { holidayHasFamilies, searchResult } = useHolidayFamilies(
    query,
    searchBy,
    selectedHoliday
  );
  const resultHasFamilies = searchResult.length > 0;

  const {
    addToCompletion,
    completionList,
    removeFromCompletion,
    resetCompletionList,
  } = useCompletionBuilder();
  const hasCompletionFamilies = completionList.length > 0;

  if (!hasHolidays) return <NoHolidays pageTitle={pageTitle} />;
  if (!holidayHasFamilies)
    return (
      <h1 className="text-center mt-5">
        שגיאה בטעינת משפחות של החג {selectedHoliday}
      </h1>
    );

  function generateHolidayCompletion() {
    if (!hasCompletionFamilies) {
      toast.warn("לא ניתן ליצור דף השלמות ללא משפחות", {
        toastId: "no-selected-families",
      });
      return;
    }

    const title = titleRef.current?.value || "השלמות";
    createCompletionHolidayPrintable(
      selectedHoliday || "",
      title,
      completionList
    )
      .then(() => {
        toast.success(
          `יצרת דף השלמות בשם ${title} עם ${completionList.length} משפחות בהצלחה`
        );
        resetCompletionList();
      })
      .catch(() => toast.error("קרתה שגיאה בלתי צפויה"));
  }

  return (
    <>
      <main className="text-center">
        <h1 className="mt-5 mb-4">{pageTitle}</h1>
        <Row className="mx-5">
          <Col className="text-center ps-5" sm="8">
            <SearchRow
              onQueryChange={(q: string) => setQuery(q)}
              onSearchByChange={(value: string) => setSearchBy(value)}
              queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
              searchBy={buttons}
            />
            <Row className="mx-5">
              {resultHasFamilies ? (
                <Table
                  columns={holidayFamiliesSelectionTableHeaders}
                  data={searchResult}
                  dataIdProp={familyIdProp}
                  headerHighlight={getSearchByHeader(searchBy)}
                  LastColumn={SelectionAddButton(addToCompletion)}
                />
              ) : (
                <h2 className="fw-light my-5">לא נמצאו משפחות שצריכות השלמה</h2>
              )}
            </Row>
          </Col>
          <Col sm="4" style={{ marginBottom: "150px" }}>
            {hasCompletionFamilies ? (
              <>
                <label className="fs-3 ps-4">כותרת:</label>
                <input
                  className="fs-4 mb-4 p-2 rounded form-text-input"
                  placeholder="הכנס כותרת..."
                  ref={titleRef}
                  type="text"
                />
                <Table
                  columns={holidayFamiliesSelectionTableHeaders}
                  data={completionList}
                  dataIdProp={familyIdProp}
                  LastColumn={SelectionRemoveButton(removeFromCompletion)}
                  numberedTable
                />
              </>
            ) : (
              <h5 className="fw-light my-5">- אין משפחות בדף ההשלמה -</h5>
            )}
          </Col>
        </Row>
      </main>
      <button
        className="fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={generateHolidayCompletion}
        type="button"
      >
        <span className="ps-3">יצירת הדף</span>
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

function useHolidayFamilies(
  query: string,
  searchBy: string,
  holidayName: string
) {
  const regularFamilies = useHolidayRegularFamilies(holidayName);
  const addedFamilies = useHolidayAddedFamilies(holidayName);
  const families = [...regularFamilies, ...addedFamilies];

  const filtered = families.filter((family) => {
    const key = getSearchByHeader(searchBy);
    const familyKey = String(family[key] ?? "");
    return familyKey.includes(query);
  });

  return { holidayHasFamilies: families.length > 0, searchResult: filtered };
}

function useHolidayRegularFamilies(holidayName: string) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!holidayName) return;

    getHolidayRegularFamilies(holidayName)
      .then((res) => {
        setFamilies(res.data.families);
      })
      .catch((error) =>
        console.error(
          "Error occurred while trying to get holiday regular families",
          error
        )
      );
  }, [holidayName]);

  return families;
}

function useHolidayAddedFamilies(holidayName: string) {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (!holidayName) return;

    getHolidayStatus(holidayName)
      .then((res) => {
        setFamilies(res.data.status.added);
      })
      .catch((error) =>
        console.error(
          "Error occurred while trying to get holiday extra families status",
          error
        )
      );
  }, [holidayName]);

  return families;
}

function useCompletionBuilder() {
  const [completionList, setCompletionList] = useState<CompletionFamily[]>([]);

  const isSameFamily = (first: CompletionFamily, second: CompletionFamily) =>
    first[familyIdProp] === second[familyIdProp];

  function addToCompletion(item: CompletionFamily) {
    if (completionList.findIndex((f) => isSameFamily(f, item)) !== -1) {
      toast.warn(`המשפחה ${item[familyIdProp]} כבר נמצאת ברשימת ההשלמות`, {
        toastId: item[familyIdProp],
      });
      return;
    }

    setCompletionList((prev) => [...prev, item]);
  }

  function removeFromCompletion(item: CompletionFamily) {
    setCompletionList((prev) => prev.filter((f) => !isSameFamily(f, item)));
  }

  function resetCompletionList() {
    setCompletionList([]);
  }

  return {
    addToCompletion,
    completionList,
    removeFromCompletion,
    resetCompletionList,
  };
}

export default HolidayCompletion;
