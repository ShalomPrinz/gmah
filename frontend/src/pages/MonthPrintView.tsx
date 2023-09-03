import { useEffect, useState } from "react";

import { ColumnList, NoMonthReports } from "../components";
import { useReportContext } from "../contexts";
import { getPrintableFiles, getPrintableReport } from "../services";
import { createPdfBlob, openNewTab } from "../util";

const pageTitle = "הדפסת דוח קבלה לנהגים";
function MonthPrintView() {
  const { reportsAvailable, selectedReport } = useReportContext();
  const files = usePrintableFiles(selectedReport);
  const hasFiles = files.length !== 0;

  const [selectedPrintable, setSelectedPrintable] = useState("");
  const url = usePrintableReport(selectedReport, selectedPrintable);

  if (!reportsAvailable) return <NoMonthReports pageTitle={pageTitle} />;
  if (!hasFiles)
    return (
      <div className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <h3>
          אין קבצים להדפסה בחודש <strong>{selectedReport}</strong>.
        </h3>
      </div>
    );

  const reportPickerWidth = reportsAvailable ? "30%" : "80%";

  return (
    <>
      <main className="mt-5 text-center d-flex justify-content-center">
        <div className="mx-5" style={{ width: reportPickerWidth }}>
          <h1>{pageTitle}</h1>
          <h2 className="fw-bold my-5">דוח קבלה {selectedReport}</h2>
          <ColumnList
            list={files}
            onItemSelect={(item) => setSelectedPrintable(item)}
          />
          {url && (
            <button
              className="bg-default rounded p-2 fs-4 mt-5"
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

function usePrintableFiles(reportName: string) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!reportName) return;

    getPrintableFiles(reportName)
      .then((res) => setFiles(res.data.files))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get month printable files",
          err
        );
      });
  }, [reportName]);

  return files;
}

function usePrintableReport(reportName: string, printable: string) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!reportName) return;

    getPrintableReport(reportName, printable)
      .then((res) => setUrl(createPdfBlob(res.data)))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get and display printable report",
          err
        );
      });
  }, [reportName, printable]);

  return url;
}

export default MonthPrintView;
