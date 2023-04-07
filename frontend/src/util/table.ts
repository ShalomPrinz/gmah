/**
 * This util module is meant to support convert Microsoft Word table data
 * to js array.
 *
 * Assumptions:
 *  - Table rows are divided by ROW_DELIMITER
 *  - Table cells are divided by CELL_DELIMITER
 */

import JSZip from "jszip";

import { getLines, isString } from "./string";
import { familyProperties } from "../modules";
import { useEffect, useState } from "react";

type ParsedTableRow = {
  [header: string]: string;
};

type ParsedTable = ParsedTableRow[];

const DEFAULT_CELL_VALUE = "";
const CELL_DELIMITER = "\t";
const ROW_DELIMITER = "\n";

const MINIMUM_TABLE_LINES = 2; // 1 Header + 1 Content
const TABLE_HEADERS_NUM = 7; // שם מלא, רחוב, בניין, דירה, קומה,מס' בית, מס' פלאפון

const TABLE_FORMAT_VALID = "validTable";

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Counts cells number in a tableRow string. Empty cells does not count
 */
function countCells(tableRow: string) {
  return tableRow
    .split(CELL_DELIMITER)
    .filter((cell) => cell.trim() !== DEFAULT_CELL_VALUE).length;
}

/**
 * Validates "text" is a string, with at least MINIMUM_TABLE_LINES lines
 * and that the first line has TABLE_HEADERS_NUM cells.
 *
 * Returns TABLE_FORMAT_VALID if validation succeed, and error message otherwise.
 */
function validateTableFormat(text: any) {
  if (!text || !isString(text)) {
    return "יש בעיה בטבלה. העתק את הטבלה מוורד באמצעות בחירת כל תאי הטבלה או גרור את הקובץ הנכון";
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
 * Fills the given row object with default value for each cell that
 * doesn't have a value, and removes all row fields that are not part of
 * familyProperties.
 */
function fillRow(row: ParsedTableRow) {
  familyProperties.forEach((p) => (row[p] = row[p] ?? DEFAULT_CELL_VALUE));
  return Object.keys(row).reduce<ParsedTableRow>(
    (filteredRow, key) =>
      familyProperties.includes(key)
        ? { ...filteredRow, [key]: row[key] }
        : filteredRow,
    {}
  );
}

/**
 * Parses the given string to js array with objects.
 * Each object in the array represents a row in the table.
 * Each property of an object represents a cell in the table.
 * The property key equals to the matching column header,
 * and the value is the data in the cell itself.
 */
function parseTable(text: string): ParsedTable {
  const lines = getLines(text);
  const headers = lines[0].split(CELL_DELIMITER);

  const rows: ParsedTable = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(CELL_DELIMITER);

    const row: ParsedTableRow = {};
    headers.forEach(
      (header, index) => (row[header] = cells[index] ?? DEFAULT_CELL_VALUE)
    );
    rows.push(fillRow(row));
  }

  return rows;
}

enum ConvertError {
  DOC_MISSING_TABLE = "הקובץ שהעברת אינו מכיל טבלה, אנא בדוק שאתה מעביר את הקובץ הנכון",
  NOT_DOCX_FILE = "הקובץ שהעברת אינו מסוג וורד",
  UNEXPECTED_ERROR = "קרתה תקלה לא צפויה, אתה יכול לנסות להעתיק את הטבלה מהקובץ במקום להעביר את הקובץ ישירות",
}

/**
 * Gets a Word document xml and converts the first table in the document
 * to the table format.
 *
 * Returns the table if the document contains one.
 * If the document doesn't contain a table, returns DOC_MISSING_TABLE.
 */
function xmlToTable(docXml: string) {
  const docTables = new DOMParser()
    .parseFromString(docXml, "text/xml")
    .getElementsByTagName("w:tbl");

  if (docTables.length === 0) return ConvertError.DOC_MISSING_TABLE;

  const firstTableRows = docTables[0].getElementsByTagName("w:tr");
  return Array.from(firstTableRows)
    .map((row) =>
      Array.from(row.getElementsByTagName("w:tc"))
        .map(
          (cell) =>
            cell.getElementsByTagName("w:t")[0]?.textContent ??
            DEFAULT_CELL_VALUE
        )
        .join(CELL_DELIMITER)
    )
    .join(ROW_DELIMITER);
}

/**
 * Converts the given file to the table format, and calls callback with the result.
 *
 * If convertion is successful, it calls callback with the convertion result.
 * If some error occurred during convertion, it calls callback with result as an empty
 * string and a ConvertError enum value which describes the error.
 */
function convertDocxTable(
  file: File,
  callback: (result: string, error?: ConvertError) => void
) {
  if (file.type !== DOCX_MIME_TYPE) {
    callback("", ConvertError.NOT_DOCX_FILE);
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const result = await new JSZip()
      .loadAsync(reader.result as ArrayBuffer)
      .then((jszip) =>
        jszip
          .file("word/document.xml")
          ?.async("string")
          .then((docXml) => xmlToTable(docXml))
      );

    if (!result) callback("", ConvertError.UNEXPECTED_ERROR);
    else if (Object.values(ConvertError).includes(result as ConvertError))
      callback("", result as ConvertError);
    else callback(result);
  };
  reader.readAsArrayBuffer(file);
}

/**
 * This hook exposes table module to React.
 * When a component that uses this hook is mounted, this hook will monitor
 * any paste or drop event and try to parse its data to table format.
 *
 * onerror will be called if some error occurred during the parse process.
 *
 * Returns an object that contains the parsed table, parses count and
 * a function that parses manually latest copied text from clipboard.
 */
function useTableParser(onerror: (message: string) => void) {
  const [parseCount, setParseCount] = useState(0);
  const [parsed, setParsed] = useState<ParsedTable>([]);

  function parse(data: string) {
    const validationResult = validateTableFormat(data);
    if (validationResult != TABLE_FORMAT_VALID) {
      onerror(validationResult);
      return;
    }

    const parsed = parseTable(data);
    if (parsed && parsed.length) {
      setParsed(parsed);
      setParseCount((count) => count + 1);
    }
  }

  function parseFile(file: File) {
    convertDocxTable(file, (result, error) => {
      if (error) onerror(error);
      else if (result !== "") parse(result);
    });
  }

  function parseFromClipboard() {
    navigator.clipboard.readText().then((text) => parse(text));
  }

  function handleDrop(event: Event) {
    event.preventDefault();
    const { dataTransfer } = event as DragEvent;
    if (!dataTransfer) return;

    if (dataTransfer.files.length > 0) {
      parseFile(dataTransfer.files[0]);
    } else {
      parse(dataTransfer.getData("text"));
    }
  }

  function handlePaste(event: Event) {
    event.preventDefault();
    const { clipboardData } = event as ClipboardEvent;
    if (!clipboardData) return;

    parse(clipboardData.getData("text/plain"));
  }

  useEffect(() => {
    const dragoverHandler = (e: Event) => e.preventDefault();
    const dropHandler = (e: Event) => handleDrop(e);
    const pasteHandler = (e: Event) => handlePaste(e);

    window.addEventListener("dragover", dragoverHandler);
    window.addEventListener("drop", dropHandler);
    window.addEventListener("paste", pasteHandler);

    return () => {
      window.removeEventListener("dragover", dragoverHandler);
      window.removeEventListener("drop", dropHandler);
      window.removeEventListener("paste", pasteHandler);
    };
  }, []);

  return { parsed, parseCount, parseFromClipboard };
}

export { useTableParser };
