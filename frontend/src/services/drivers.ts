import { get, put, remove } from "./http";

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

async function removeFamilyDriver(familyName: string) {
  await remove("family/driver/remove", {
    params: {
      family_name: familyName,
    },
  });
}

export {
  getDriverFamilies,
  getDriverlessFamilies,
  getDrivers,
  removeFamilyDriver,
  updateDriverName,
};
