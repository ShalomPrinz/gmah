import { useEffect, useState } from "react";

import { ColumnList, NoHolidays } from "../components";
import { useHolidayContext } from "../contexts";
import { getPrintableFiles, getPrintableReport } from "../services";
import { createPdfBlob, openNewTab } from "../util";

const pageTitle = "הדפסת חלוקת חג לנהגים";
function HolidayPrintView() {
  const { hasHolidays, selectedHoliday } = useHolidayContext();
  const files = usePrintableFiles(selectedHoliday);
  const hasFiles = files.length !== 0;

  const [selectedPrintable, setSelectedPrintable] = useState("");
  const url = usePrintableReport(selectedHoliday, selectedPrintable);

  if (!hasHolidays) return <NoHolidays pageTitle={pageTitle} />;
  if (!hasFiles)
    return (
      <div className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <h3>
          אין קבצים להדפסה עבור החג <strong>{selectedHoliday}</strong>.
        </h3>
      </div>
    );

  return (
    <>
      <main className="mt-5 text-center d-flex justify-content-center">
        <div className="mx-5" style={{ width: "30%" }}>
          <h1>{pageTitle}</h1>
          <h2 className="fw-bold my-5">{selectedHoliday}</h2>
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

function usePrintableFiles(holidayName: string) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!holidayName) return;

    getPrintableFiles(holidayName)
      .then((res) => setFiles(res.data.files))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get month printable files",
          err
        );
      });
  }, [holidayName]);

  return files;
}

function usePrintableReport(holidayName: string, printable: string) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!holidayName) return;

    getPrintableReport(holidayName, printable)
      .then((res) => setUrl(createPdfBlob(res.data)))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get and display printable report",
          err
        );
      });
  }, [holidayName, printable]);

  return url;
}

export default HolidayPrintView;
