import { get } from "./http";

function getPrintableReport(reportName: string) {
  return get("/print/month", {
    params: {
      report_name: reportName,
    },
    responseType: "blob",
  });
}

export { getPrintableReport };
