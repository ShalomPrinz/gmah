import { useEffect, useState } from "react";

import { getReportsList } from "../services";
import { Report } from "../types";

function useMonthReports(reloadKey: number) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, [reloadKey]);

  return reports as Report[];
}

export { useMonthReports };
