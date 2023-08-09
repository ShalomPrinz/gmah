import { get } from "./http";

async function getDrivers() {
  return get("drivers");
}

async function getDriverFamilies(driverName: string) {
  return get("drivers/families", {
    params: {
      driver_name: driverName,
    },
  });
}

export { getDriverFamilies, getDrivers };
