import { get, post } from "./http";

function generateMonthReport(name: string) {
  return post("generate/month", { name });
}

function getNoManagerDrivers() {
  return get("validate/drivers");
}

function getReportsList() {
  return get("reports");
}

function getReport(reportName: string, query: string, by: string) {
  return get("report", {
    params: {
      report_name: reportName,
      query,
      by,
    },
  });
}

export { generateMonthReport, getNoManagerDrivers, getReportsList, getReport };
