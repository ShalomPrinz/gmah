import { useEffect, useState } from "react";

import { ColumnList } from "../components";
import { getPrintableReport, getReportsList } from "../services";
import { createPdfBlob, openNewTab } from "../util";

function MonthPrintView() {
  const options = useMonthReports();
  const [selectedReport, setSelectedReport] = useState("");

  const url = usePrintableReport(selectedReport);

  return (
    <>
      <main className="mt-5 text-center d-flex justify-content-center">
        <div className="mx-5" style={{ width: "30%" }}>
          <h1 className="text-center">הדפסת דוח קבלה לנהגים</h1>
          <h3 className="my-5">בחר דוח קבלה:</h3>
          <ColumnList
            key={options.length}
            list={options}
            onItemSelect={setSelectedReport}
          />
          {url && (
            <button
              className="bg-default rounded p-2 fs-4 mt-4"
              onClick={() => openNewTab(url)}
              type="button"
            >
              פתח בחלון חדש
            </button>
          )}
        </div>
        {url && (
          <object
            className="mx-5"
            data={url}
            height="500"
            title="PDF Viewer"
            type="application/pdf"
            width="55%"
          />
        )}
      </main>
    </>
  );
}

function useMonthReports() {
  const [reports, setReports] = useState([]);
  const options = reports.map((report) => ({
    title: report,
  }));

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, []);

  return options;
}

function usePrintableReport(reportName: string) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getPrintableReport(reportName)
      .then((res) => setUrl(createPdfBlob(res.data)))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get and display printable report",
          err
        );
      });
  }, [reportName]);

  return url;
}

export default MonthPrintView;