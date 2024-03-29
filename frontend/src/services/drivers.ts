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

async function getDriverlessFamilies() {
  return get("drivers/driverless");
}

async function updateDriverName(originalName: string, newName: string) {
  return put("drivers/update", {
    original: originalName,
    updated: newName,
  });
}

async function updateDriverPrintStatus(
  driverName: string,
  printStatus: string
) {
  return put("drivers/print", {
    driver_name: driverName,
    print_status: printStatus,
  });
}

export {
  getDriverFamilies,
  getDriverlessFamilies,
  getDrivers,
  updateDriverName,
  updateDriverPrintStatus,
};
