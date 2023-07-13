import { get, post, put } from "./http";
import type { Receipt } from "../types";

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

function updateFamilyReceipt(
  reportName: string,
  familyName: string,
  receipt: Receipt
) {
  return put("/report/update", {
    report_name: reportName,
    family_name: familyName,
    receipt,
  });
}

export {
  generateMonthReport,
  getNoManagerDrivers,
  getReportsList,
  getReport,
  updateFamilyReceipt,
};
