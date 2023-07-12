import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Dropdown, Option, Table } from "../components";
import { familyIdProp, reportTableHeaders } from "../modules";
import { getReport, getReportsList } from "../services";

const NoReportsMessage = () => (
  <h3 className="text-center mt-5">
    אין דוחות קבלה. באפשרותך
    <Link className="link-decoration rounded fs-5 p-3 me-2 fs-3" to="/reports">
      לייצר דוח קבלה חדש
    </Link>
  </h3>
);

const defaultSelection = "0";
function MonthTracker() {
  const options = useMonthReports();
  const { onSelect, selectedReport } = useReportSelection(options);
  const report = useReportSearch(selectedReport, "", "");

  const hasOptions = options.length > 0;

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1 className="mx-5">מעקב חלוקה חודשי</h1>
        {hasOptions && (
          <Dropdown
            title="בחר דוח קבלה"
            onSelect={onSelect}
            options={options}
          />
        )}
      </div>
      <main className="mt-5 text-center mx-auto w-75">
        {hasOptions ? (
          <Table
            columns={reportTableHeaders}
            data={report ?? []}
            dataIdProp={familyIdProp}
          />
        ) : (
          <NoReportsMessage />
        )}
      </main>
    </>
  );
}

function useMonthReports() {
  const [reports, setReports] = useState([]);
  const options = reports.map((report, index) => ({
    eventKey: index.toString(),
    value: report,
  }));

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, []);

  return options;
}

function useReportSelection(options: Option[]) {
  const [selected, setSelected] = useState(defaultSelection);
  const selectedReport = options.find(
    ({ eventKey }) => selected === eventKey
  )?.value;

  const onSelect = (eventKey: string | null) =>
    eventKey && setSelected(eventKey);

  return { onSelect, selectedReport };
}

function useReportSearch(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [report, setReport] = useState();

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

export default MonthTracker;
