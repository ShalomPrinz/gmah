import { useEffect, useState } from "react";

import { ColumnList, ConditionalList, Search } from "../components";
import { useLocationState } from "../hooks";
import { familyIdProp } from "../modules";
import { getReport } from "../services";

interface MarkMode {
  id: string;
  label: string;
  property: string;
  searchBy: string;
}

const driverMarkMode = {
  id: "BY_DRIVER",
  label: "סימון לפי נהג",
  property: "נהג",
  searchBy: "driver",
};

const manualMarkMode = {
  id: "MANUAL",
  label: "סימון ידני",
  property: familyIdProp,
  searchBy: "name",
};

const markModes = [driverMarkMode, manualMarkMode];
const defaultMode = driverMarkMode;

const extractPropertyToList = (list: any[], property: string) =>
  Array.from<string>(
    list.reduce((set, item) => {
      set.add(item[property]);
      return set;
    }, new Set<string>())
  ).map((item: string) => ({
    title: item,
  }));

function MonthReceiptMark() {
  const reportName = useLocationState<string>("MonthReceiptMark", "report");

  const [query, setQuery] = useState("");
  const [markMode, setMarkMode] = useState(defaultMode);

  const searchResult = useReportSearch(reportName, query, markMode.searchBy);
  const columnListData = extractPropertyToList(searchResult, markMode.property);

  const [selectedItem, setSelectedItem] = useState("");

  const modeButtonCallback = (mode: MarkMode) => {
    const color =
      markMode.id === mode.id
        ? "bg-primary text-white"
        : "bg-white text-secondary";
    return (
      <button
        className={`m-2 p-3 ${color} rounded fs-4 border border-0`}
        onClick={() => setMarkMode(mode)}
      >
        {mode.label}
      </button>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <h1 className="mx-5 my-auto">סימון קבלה - {reportName}</h1>
        <ConditionalList list={markModes} itemCallback={modeButtonCallback} />
      </div>
      <main className="mx-5 d-flex">
        <div style={{ width: "40%" }}>
          <Search
            onChange={(q: string) => setQuery(q)}
            placeholder={`הכנס ${markMode.property} של משפחה...`}
          />
          <ColumnList
            list={columnListData}
            key={`${columnListData.length}${markMode.id}`}
            onItemSelect={setSelectedItem}
          />
        </div>
        <div>
          {markMode.label} - {selectedItem}
        </div>
      </main>
    </>
  );
}

function useReportSearch(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [report, setReport] = useState(Array());

  useEffect(() => {
    if (typeof reportName === "undefined") return;

    getReport(reportName, query, searchBy)
      .then((res) => setReport(res.data.report))
      .catch((error) =>
        console.error("Error occurred while trying to search in report", error)
      );
  }, [reportName, query, searchBy]);

  return report;
}

export default MonthReceiptMark;
