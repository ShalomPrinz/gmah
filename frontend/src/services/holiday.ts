import { get, post } from "./http";

async function startNewHoliday(holidayName: string, holidayFamilies: string[]) {
  return post("holiday/new", {
    holiday_name: holidayName,
    holiday_families: holidayFamilies,
  });
}

async function getHolidaysList() {
  return get("holidays");
}

export { getHolidaysList, startNewHoliday };
