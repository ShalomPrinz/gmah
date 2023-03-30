import { useEffect, useRef, useState } from "react";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import {
  TABLE_FORMAT_VALID,
  isString,
  parseTable,
  validateTableFormat,
} from "../util";
import type { ParsedTable } from "../util";

function AddManyFamilies() {
  const autoFocusRef = useAutoFocus<HTMLDivElement>();
  const [table, setTable] = useState<ParsedTable>([]);

  const setTableData = (data: string) => {
    const parsed = parsePastedData(data);
    if (parsed && parsed.length) setTable(parsed);
  };

  const handlePaste = (event: any) =>
    setTableData(event?.clipboardData?.getData("text/plain"));

  const performPaste = () =>
    navigator.clipboard.readText().then((text) => setTableData(text));

  return (
    <div onPaste={handlePaste} ref={autoFocusRef} tabIndex={-1}>
      <main className="container my-5 text-center">
        <Row>
          <h2>הדבק את טבלת המצטרפים החדשים לגמח</h2>
          <p>
            על מנת להדביק את הטבלה, הקש{" "}
            <span className="fw-bold mx-2 fs-5">Ctrl + V</span> או{" "}
            <button
              className="bg-default rounded px-3 py-1 me-2"
              onClick={performPaste}
            >
              לחץ כאן
            </button>
          </p>
          <p>שים לב: אתה צריך להעתיק את כל הטבלה, כולל את שורת הכותרות</p>
        </Row>
        <Row>
          <pre>{JSON.stringify(table)}</pre>
        </Row>
      </main>
    </div>
  );
}

function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => ref?.current?.focus(), [ref]);
  return ref;
}

function parsePastedData(pastedString: string): ParsedTable {
  if (!pastedString || !isString(pastedString)) {
    toast.error("קרתה תקלה בניסיון לקבל את המידע שהודבק");
    return [];
  }

  const validationResult = validateTableFormat(pastedString);
  if (validationResult != TABLE_FORMAT_VALID) {
    toast.error(validationResult);
    return [];
  }

  return parseTable(pastedString);
}

export default AddManyFamilies;
