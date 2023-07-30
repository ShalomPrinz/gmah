import { get, post } from "./http";
import { CompletionFamily } from "../modules";

function getPrintableReport(reportName: string) {
  return get("/print/month", {
    params: {
      report_name: reportName,
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

export { createCompletionPage, getPrintableReport };
