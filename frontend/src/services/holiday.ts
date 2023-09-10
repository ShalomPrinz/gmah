import { get, post, put } from "./http";

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

export {
  getHolidayDrivers,
  getHolidayDriverFamilies,
  getHolidayDriverlessFamilies,
  getHolidaysList,
  getHolidayStatus,
  startNewHoliday,
  updateHolidayStatus,
};
