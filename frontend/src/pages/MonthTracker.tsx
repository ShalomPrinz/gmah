import { useEffect, useState } from "react";
import { Dropdown, Option } from "../components";
import { getReportsList } from "../services";
import { Link } from "react-router-dom";

const defaultSelection = "0";
function MonthTracker() {
  const options = useMonthReports();
  const { onSelect, selectedReport } = useReportSelection(options);

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
      {!hasOptions && (
        <h3 className="text-center mt-5">
          אין דוחות קבלה. באפשרותך
          <Link
            className="link-decoration rounded fs-5 p-3 me-2 fs-3"
            to="/reports"
          >
            לייצר דוח קבלה חדש
          </Link>
        </h3>
      )}
      {hasOptions && <h2>בחירה: {selectedReport}</h2>}
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

export default MonthTracker;
