import { get, post, put } from "./http";
import type { Receipt } from "../types";

function generateMonthReport(name: string, override: boolean) {
  return post("generate/month", { name, override_name: override });
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

function getReportColumn(reportName: string, query: string, by: string) {
  return get("report/column", {
    params: {
      report_name: reportName,
      query,
      by,
    },
  });
}

function getReceiptStatus(
  reportName: string,
  name: string,
  type: "family" | "driver"
) {
  return get("report/get", {
    params: {
      report_name: reportName,
      name,
      name_type: type,
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
  getReceiptStatus,
  getReport,
  getReportColumn,
  getReportsList,
  updateFamilyReceipt,
};
