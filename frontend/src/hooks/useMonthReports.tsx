import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getReportsList } from "../services";

function useMonthReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, []);

  return reports;
}

function NoMonthReports() {
  return (
    <h3 className="text-center mt-5">
      אין דוחות קבלה. באפשרותך
      <Link
        className="link-decoration rounded fs-5 p-3 me-2 fs-3"
        to="/reports"
      >
        לייצר דוח קבלה חדש
      </Link>
    </h3>
  );
}

export { NoMonthReports, useMonthReports };
