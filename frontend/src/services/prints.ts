import { get, post } from "./http";
import { CompletionFamily } from "../modules";

function getPrintableFiles(reportName: string) {
  return get("/print/month/all", {
    params: {
      report_name: reportName,
    },
  });
}

function getHolidayPrintableFiles(holidayName: string) {
  return get("/print/holiday/all", {
    params: {
      holiday_name: holidayName,
    },
  });
}

function getPrintableReport(reportName: string, printable: string) {
  return get("/print/month", {
    params: {
      report_name: reportName,
      printable,
    },
    responseType: "blob",
  });
}

function getHolidayPrintable(holidayName: string, printable: string) {
  return get("/print/holiday", {
    params: {
      holiday_name: holidayName,
      printable,
    },
    responseType: "blob",
  });
}

function createCompletionPage(
  reportName: string,
  title: string,
  families: CompletionFamily[]
) {
  return post("/report/completion/build", {
    month_name: reportName,
    title,
    families,
  });
}

function createMainHolidayPrintable(holidayName: string) {
  return post("/holiday/generate/printable", {
    holiday_name: holidayName,
  });
}

function createCompletionHolidayPrintable(
  holidayName: string,
  title: string,
  content: CompletionFamily[]
) {
  return post("/print/generate", {
    holiday_name: holidayName,
    title,
    content,
  });
}

export {
  createCompletionPage,
  createCompletionHolidayPrintable,
  createMainHolidayPrintable,
  getPrintableFiles,
  getHolidayPrintableFiles,
  getPrintableReport,
  getHolidayPrintable,
};
