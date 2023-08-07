import { get, post } from "./http";
import { CompletionFamily } from "../modules";

function getPrintableFiles(reportName: string) {
  return get("/print/month/all", {
    params: {
      report_name: reportName,
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

export { createCompletionPage, getPrintableFiles, getPrintableReport };
