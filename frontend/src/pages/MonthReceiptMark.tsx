import { useEffect, useState } from "react";

import MonthDriverMark from "./MonthDriverMark";
import MonthFamilyMark from "./MonthFamilyMark";

import { ColumnList, ConditionalList, Search } from "../components";
import type { ListItem } from "../components";
import { useLocationState, useReloadKey } from "../hooks";
import { getReportColumn } from "../services";

interface MarkMode {
  id: string;
  label: string;
  property: string;
  searchBy: string;
}

const familyMarkMode: MarkMode = {
  id: "FAMILY",
  label: "סימון לפי משפחה",
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

  const { reportColumn, reloadReportColumnList } = useReportColumn(
    reportName,
    markMode.searchBy
  );

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
          markMode={markMode}
          setSelected={setSelected}
        />
        <div className="text-center my-3 mx-5" style={{ width: "45%" }}>
          {noSelectedItem ? (
            <h3 className="my-5 fw-light">{noItemMessage}</h3>
          ) : isFamilyMode ? (
            <MonthFamilyMark
              familyName={selected}
              familyRemovedCallback={() => {
                setSelected("");
                reloadReportColumnList();
              }}
              key={selected}
              reportName={reportName}
            />
          ) : (
            <MonthDriverMark
              driverName={selected}
              key={selected}
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
  markMode: MarkMode;
  setSelected: (selected: string) => void;
}

function QueryDisplay({
  columnList,
  markMode,
  setSelected,
}: QueryDisplayProps) {
  const [query, setQuery] = useState("");
  const searchResult = columnList.filter((item) => item.includes(query));

  useEffect(() => setQuery(""), [markMode.id]);

  return (
    <div className="mx-5" style={{ width: "40%" }}>
      <Search
        key={markMode.id}
        onChange={setQuery}
        placeholder={`הכנס ${markMode.property} של משפחה...`}
      />
      <ColumnList list={searchResult} onItemSelect={setSelected} />
    </div>
  );
}

function useReportColumn(reportName: string, searchBy: string) {
  const [searchResult, setSearchResult] = useState([]);
  const { reloadKey, updateKey } = useReloadKey();

  useEffect(() => {
    getReportColumn(reportName, "", searchBy)
      .then((res) => setSearchResult(res.data.report_column))
      .catch((error) =>
        console.error("Error occurred while trying to search in report", error)
      );
  }, [reportName, searchBy, reloadKey]);

  return { reportColumn: searchResult, reloadReportColumnList: updateKey };
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
