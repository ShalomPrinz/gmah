import { get, post } from "./http";

function generateMonthReport(name: string) {
  return post("generate/month", { name });
}

function getNoManagerDrivers() {
  return get("validate/drivers");
}

export { generateMonthReport, getNoManagerDrivers };
