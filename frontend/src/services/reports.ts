import { get, post, put } from "./http";
import type { DriverReceipt, Receipt } from "../types";

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

function getFamilyReceiptStatus(reportName: string, name: string) {
  return get("report/get-family", {
    params: {
      report_name: reportName,
      name,
    },
  });
}

function getDriverReceiptStatus(reportName: string, name: string) {
  return get("report/get-driver", {
    params: {
      report_name: reportName,
      name,
    },
  });
}

function updateFamilyReceipt(
  reportName: string,
  familyName: string,
  receipt: Receipt
) {
  return put("/report/update-family", {
    report_name: reportName,
    family_name: familyName,
    receipt,
  });
}

function updateDriverStatus(reportName: string, status: DriverReceipt[]) {
  return put("/report/update-driver", {
    report_name: reportName,
    status,
  });
}

export {
  generateMonthReport,
  getDriverReceiptStatus,
  getFamilyReceiptStatus,
  getNoManagerDrivers,
  getReport,
  getReportColumn,
  getReportsList,
  updateDriverStatus,
  updateFamilyReceipt,
};
