import { getLines, isString } from "./string";

/**
 * This util module is meant to support convert Microsoft Word table data
 * to js array.
 *
 * Assumptions:
 *  - Table rows are divided by "\n"
 *  - Table cells are divided by "\t"
 *  - If cell is empty, its string is nothing (= "")
 */

const MINIMUM_TABLE_LINES = 2; // 1 Header + 1 Content
const TABLE_HEADERS_NUM = 7; // שם מלא, רחוב, בניין, דירה, קומה,מס' בית, מס' פלאפון
const TABLE_FORMAT_VALID = "validTable";

/**
 * Counts cells number in a tableRow string. Empty cells does not count
 */
function countCells(tableRow: string) {
  return tableRow.split("\t").filter((cell) => cell.trim() !== "").length;
}

/**
 * Validates "text" is a string, with at least MINIMUM_TABLE_LINES lines
 * and that the first line has TABLE_HEADERS_NUM cells.
 *
 * Returns TABLE_FORMAT_VALID if validation succeed, and error message otherwise.
 */
function validateTableFormat(text: any) {
  if (!isString(text)) {
    return "הדבקת את הטבלה בצורה שגויה. העתק את הטבלה ישירות מוורד, באמצעות בחירת כל תאי הטבלה";
  }

  const lines = getLines(text);
  if (lines.length < MINIMUM_TABLE_LINES) {
    return 'על מנת להכניס משפחות לגמ"ח דרך טבלה, על הטבלה להכיל לפחות משפחה אחת';
  }

  const cellsInFirstLine = countCells(lines[0]);
  if (cellsInFirstLine != TABLE_HEADERS_NUM) {
    return `השורה הראשונה בטבלה צריכה להכיל ${TABLE_HEADERS_NUM} כותרות, אך יש בה ${cellsInFirstLine}`;
  }

  return TABLE_FORMAT_VALID;
}

/**
 * Parses the given string to js array with objects.
 * Each object in the array represents a row in the table.
 * Each property of an object represents a cell in the table.
 * The property key equals to the matching column header,
 * and the value is the data in the cell itself.
 */
function parseTable(text: string) {
  const lines = getLines(text);
  const headers = lines[0].split("\t");

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split("\t");

    const row: { [header: string]: string } = {};
    headers.forEach((header, index) => (row[header] = cells[index]));
    rows.push(row);
  }

  return rows;
}

export { TABLE_FORMAT_VALID, parseTable, validateTableFormat };
