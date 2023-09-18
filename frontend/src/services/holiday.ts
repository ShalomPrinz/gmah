import { get, post, put, remove } from "./http";

async function startNewHoliday(holidayName: string) {
  return post("holiday/new", {
    holiday_name: holidayName,
  });
}

async function getHolidaysList() {
  return get("holidays");
}

async function getHolidayStatus(holidayName: string) {
  return get("holiday/status", {
    params: {
      holiday_name: holidayName,
    },
  });
}

async function getHolidayRegularFamilies(holidayName: string) {
  return get("holiday/families", {
    params: {
      holiday_name: holidayName,
    },
  });
}

async function updateHolidayStatus(
  holidayName: string,
  holidayFamilies: string[]
) {
  return put("holiday/status/update", {
    holiday_name: holidayName,
    holiday_families: holidayFamilies,
  });
}

async function getHolidayDrivers(holidayName: string) {
  return get("holiday/drivers", {
    params: {
      holiday_name: holidayName,
    },
  });
}

async function getHolidayDriverFamilies(
  holidayName: string,
  driverName: string
) {
  return get("holiday/drivers/families", {
    params: {
      holiday_name: holidayName,
      driver_name: driverName,
    },
  });
}

async function getHolidayDriverlessFamilies(holidayName: string) {
  return get("holiday/drivers/driverless", {
    params: {
      holiday_name: holidayName,
    },
  });
}

async function removeHolidayDriver(holidayName: string, familyName: string) {
  return remove("holiday/driver/remove", {
    params: {
      holiday_name: holidayName,
      family_name: familyName,
    },
  });
}

async function addHolidayDriver(
  holidayName: string,
  familyName: string,
  driverName: string
) {
  return post("holiday/driver/add", {
    holiday_name: holidayName,
    family_name: familyName,
    driver_name: driverName,
  });
}

export {
  addHolidayDriver,
  getHolidayDrivers,
  getHolidayDriverFamilies,
  getHolidayDriverlessFamilies,
  getHolidayRegularFamilies,
  getHolidaysList,
  getHolidayStatus,
  removeHolidayDriver,
  startNewHoliday,
  updateHolidayStatus,
};
