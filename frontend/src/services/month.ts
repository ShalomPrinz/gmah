import { get } from "./http";

async function getDrivers() {
  return get("drivers");
}

export { getDrivers };
