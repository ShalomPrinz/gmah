/** Returns today date in yyyy-mm-dd format */
function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
}

const hebrewMonthNames = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

/** Gets date in yyyy-mm-dd format and returns hebrew string, e.g. 2023-07-19 -> 2023 (יולי) 19 */
function formatDate(date: string | undefined) {
  if (typeof date === "undefined" || !date) return undefined;

  const [year, month, day] = date.split("-");
  const intMonth = parseInt(month) - 1;
  if (intMonth < 0 || intMonth > hebrewMonthNames.length) return undefined;

  return `${day} ${hebrewMonthNames[intMonth]} ${year}`;
}

const getFormattedToday = () => formatDate(getTodayDate());

export { getFormattedToday, getTodayDate, formatDate };
