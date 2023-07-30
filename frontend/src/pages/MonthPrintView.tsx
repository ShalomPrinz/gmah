import { useEffect, useState } from "react";

import { NoMonthReports } from "../components";
import { useReportContext } from "../contexts";
import { getPrintableReport } from "../services";
import { createPdfBlob, openNewTab } from "../util";

const pageTitle = "הדפסת דוח קבלה לנהגים";
function MonthPrintView() {
  const { reportsAvailable, selectedReport } = useReportContext();
  const url = usePrintableReport(selectedReport);

  if (!reportsAvailable) return <NoMonthReports pageTitle={pageTitle} />;

  const reportPickerWidth = reportsAvailable ? "30%" : "80%";

  return (
    <>
      <main className="mt-5 text-center d-flex justify-content-center">
        <div className="mx-5" style={{ width: reportPickerWidth }}>
          <h1>{pageTitle}</h1>
          <h2 className="fw-bold my-5">דוח קבלה {selectedReport}</h2>
          {url && (
            <button
              className="bg-default rounded p-2 fs-4"
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

function usePrintableReport(reportName: string) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!reportName) return;

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
