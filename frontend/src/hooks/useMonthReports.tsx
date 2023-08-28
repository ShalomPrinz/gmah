import { useEffect, useState } from "react";

import { getReportsList } from "../services";
import { Report } from "../types";

function useMonthReports(reloadKey: number) {
  const [reports, setReports] = useState<Report[]>([]);
  const activeReportIndex = reports.findIndex((report) => report.active);

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, [reloadKey]);

  return { activeReportIndex, reports };
}

export { useMonthReports };
