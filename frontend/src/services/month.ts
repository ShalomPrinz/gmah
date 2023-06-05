import { get, post } from "./http";

async function getDrivers() {
  return get("drivers");
}

async function updateDrivers(drivers: Array<any>) {
  return post("drivers", { drivers });
}

export { getDrivers, updateDrivers };
