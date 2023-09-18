import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ColumnList, NoHolidays } from "../components";
import { useHolidayContext } from "../contexts";
import {
  getHolidayPrintableFiles,
  getHolidayPrintable,
  createMainHolidayPrintable,
} from "../services";
import { createPdfBlob, openNewTab } from "../util";

const pageTitle = "הדפסת חלוקת חג לנהגים";
function HolidayPrintView() {
  const { hasHolidays, selectedHoliday } = useHolidayContext();
  const [selectedPrintable, setSelectedPrintable] = useState("");
  const { files, printablesUpdated, url } = useHolidayPrintables(
    selectedHoliday,
    selectedPrintable
  );
  const hasFiles = files.length !== 0;

  if (!hasHolidays) return <NoHolidays pageTitle={pageTitle} />;

  function createPrintable() {
    createMainHolidayPrintable(selectedHoliday)
      .then(() => {
        toast.success("הקובץ להדפסה נוצר בהצלחה");
        printablesUpdated();
      })
      .catch(() => toast.error("קרתה שגיאה בלתי צפויה"));
  }

  if (!hasFiles)
    return (
      <div className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <h3>
          אין קבצים להדפסה עבור החג <strong>{selectedHoliday}</strong>.
        </h3>
        <button
          className="my-4 bg-white text-dark border border-4 border-primary fs-4 rounded p-3 button-hover"
          onClick={createPrintable}
          type="button"
        >
          הדפס עבור כל הנהגים
        </button>
      </div>
    );

  return (
    <main className="mt-5 text-center d-flex justify-content-center">
      <div className="mx-5" style={{ width: "30%" }}>
        <h1>{pageTitle}</h1>
        <h2 className="fw-bold my-5">{selectedHoliday}</h2>
        <ColumnList
          list={files}
          onItemSelect={(item) => setSelectedPrintable(item)}
        />
        {url && (
          <div>
            <button
              className="bg-default rounded p-2 fs-4 mt-5 mx-3"
              onClick={() => openNewTab(url)}
              type="button"
            >
              פתח בחלון חדש
            </button>
            <button
              className="my-4 bg-white text-dark border border-4 border-primary fs-4 rounded p-2 button-hover"
              onClick={createPrintable}
              type="button"
            >
              הדפס עבור כל הנהגים
            </button>
          </div>
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
  );
}

function useHolidayPrintables(holidayName: string, printable: string) {
  const [reloadKey, setReloadKey] = useState(0);
  function printablesUpdated() {
    setReloadKey((prev) => prev + 1);
  }

  const files = usePrintableFiles(holidayName, reloadKey);
  const url = usePrintable(holidayName, printable, reloadKey);
  return { files, printablesUpdated, url };
}

function usePrintableFiles(holidayName: string, reloadKey: number) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!holidayName) return;

    getHolidayPrintableFiles(holidayName)
      .then((res) => setFiles(res.data.files))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get holiday printable files",
          err
        );
      });
  }, [holidayName, reloadKey]);

  return files;
}

function usePrintable(
  holidayName: string,
  printable: string,
  reloadKey: number
) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!holidayName || !printable) return;

    getHolidayPrintable(holidayName, printable)
      .then((res) => setUrl(createPdfBlob(res.data)))
      .catch((err) => {
        console.error(
          "Error occurred while trying to get and display printable holiday file",
          err
        );
      });
  }, [holidayName, printable, reloadKey]);

  return url;
}

export default HolidayPrintView;
