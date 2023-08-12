import { get, put } from "./http";

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

async function updateDriverName(originalName: string, newName: string) {
  return put("drivers/update", {
    original: originalName,
    updated: newName,
  });
}

export { getDriverFamilies, getDrivers, updateDriverName };
