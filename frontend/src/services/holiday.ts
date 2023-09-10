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

export {
  getHolidaysList,
  getHolidayStatus,
  startNewHoliday,
  updateHolidayStatus,
};
