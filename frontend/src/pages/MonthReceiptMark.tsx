import { useEffect, useState } from "react";

import MonthDriverMark from "./MonthDriverMark";
import MonthFamilyMark from "./MonthFamilyMark";

import { ColumnList, ConditionalList, Search } from "../components";
import type { ListItem } from "../components";
import { useLocationState } from "../hooks";
import { getReportColumn } from "../services";
import { getUnique } from "../util";

interface MarkMode {
  id: string;
  label: string;
  property: string;
  searchBy: string;
}

const familyMarkMode: MarkMode = {
  id: "FAMILY",
  label: "סימון ידני",
  property: "שם",
  searchBy: "name",
};

const driverMarkMode: MarkMode = {
  id: "DRIVER",
  label: "סימון לפי נהג",
  property: "נהג",
  searchBy: "driver",
};

const markModes = [driverMarkMode, familyMarkMode];

function MonthMarkWrapper() {
  const reportName =
    useLocationState<string>("MonthReceiptMark", "report") ?? "";

  const { markMode, markModeCallback } = useMarkMode();
  const isFamilyMode = markMode.id === familyMarkMode.id;

  const reportColumn = useReportColumn(reportName, markMode.searchBy);

  const [resultLength, setResultLength] = useState(reportColumn.length);
  const onResultLengthChange = (newLength: number) =>
    setResultLength(newLength);

  const [selected, setSelected] = useState("");
  const noSelectedItem = selected === "";
  const noItemMessage = isFamilyMode
    ? "לא מצאנו משפחה כזו בדוח הקבלה"
    : "לא מצאנו נהג כזה בדוח הקבלה";

  return (
    <>
      <div className="d-flex justify-content-center mt-5 mb-4">
        <h1 className="mx-5 my-auto">סימון קבלה - {reportName}</h1>
        <ConditionalList itemCallback={markModeCallback} list={markModes} />
      </div>
      <main className="d-flex">
        <QueryDisplay
          columnList={reportColumn}
          onResultLengthChange={onResultLengthChange}
          searchProperty={markMode.property}
          setSelected={setSelected}
        />
        <div className="text-center my-3 mx-5" style={{ width: "45%" }}>
          {noSelectedItem ? (
            <h3 className="my-5 fw-light">{noItemMessage}</h3>
          ) : isFamilyMode ? (
            <MonthFamilyMark
              familyName={selected}
              key={resultLength}
              reportName={reportName}
            />
          ) : (
            <MonthDriverMark
              driverName={selected}
              key={resultLength}
              reportName={reportName}
            />
          )}
        </div>
      </main>
    </>
  );
}

interface QueryDisplayProps {
  columnList: ListItem[];
  onResultLengthChange: (length: number) => void;
  searchProperty: string;
  setSelected: (selected: string) => void;
}

function QueryDisplay({
  columnList,
  onResultLengthChange,
  searchProperty,
  setSelected,
}: QueryDisplayProps) {
  const [query, setQuery] = useState("");
  const searchResult = columnList.filter(({ title }) => title.includes(query));

  useEffect(
    () => onResultLengthChange(searchResult.length),
    [searchResult.length]
  );

  return (
    <div className="mx-5" style={{ width: "40%" }}>
      <Search
        onChange={setQuery}
        placeholder={`הכנס ${searchProperty} של משפחה...`}
      />
      <ColumnList
        key={searchResult.length}
        list={searchResult}
        onItemSelect={setSelected}
      />
    </div>
  );
}

function useReportColumn(reportName: string, searchBy: string) {
  const [searchResult, setSearchResult] = useState([]);
  const uniqueList = getUnique(searchResult).map((value) => ({ title: value }));

  useEffect(() => {
    getReportColumn(reportName, "", searchBy)
      .then((res) => setSearchResult(res.data.report_column))
      .catch((error) =>
        console.error("Error occurred while trying to search in report", error)
      );
  }, [reportName, searchBy]);

  return uniqueList;
}

function useMarkMode() {
  const [markMode, setMarkMode] = useState(driverMarkMode);

  const markModeCallback = (mode: MarkMode) => {
    const background = markMode.id === mode.id ? "info" : "white";
    return (
      <button
        className={`fs-4 my-auto mx-3 rounded p-3 border border-0 border-none bg-${background}`}
        onClick={() => setMarkMode(mode)}
        type="button"
      >
        {mode.label}
      </button>
    );
  };

  return { markMode, markModeCallback };
}

export default MonthMarkWrapper;
