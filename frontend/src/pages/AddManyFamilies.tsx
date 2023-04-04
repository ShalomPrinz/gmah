import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { InputTable } from "../components";
import { addFamilyHeaders, familiesArraySchema } from "../modules";
import {
  TABLE_FORMAT_VALID,
  isString,
  parseTable,
  validateTableFormat,
} from "../util";
import type { ParsedTable } from "../util";

const emptyItem = addFamilyHeaders.reduce(
  (obj: { [key: string]: string }, header) => {
    obj[header.path] = "";
    return obj;
  },
  {}
);

function AddManyFamilies() {
  const autoFocusRef = useAutoFocus<HTMLDivElement>();
  const [pasteCount, setPasteCount] = useState(0); // Force Form Reinitialize
  const [table, setTable] = useState<ParsedTable>([]);

  const setTableData = (data: string) => {
    const parsed = parsePastedData(data);
    if (parsed && parsed.length) {
      setTable(parsed);
      setPasteCount((count) => count + 1);
    }
  };

  const handlePaste = (event: any) =>
    setTableData(event?.clipboardData?.getData("text/plain"));

  const performPaste = () =>
    navigator.clipboard.readText().then((text) => setTableData(text));

  const handleSubmit = async (families: any) => {
    console.log("families submitted", families);
    return new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(true), 2000)
    );
  };

  return (
    <div onPaste={handlePaste} ref={autoFocusRef} tabIndex={-1}>
      <div className="mt-5 text-center">
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
      </div>
      <main className="text-center w-100 pe-5">
        <InputTable
          columns={addFamilyHeaders}
          emptyItem={emptyItem}
          initialData={table}
          inputsName="families"
          key={pasteCount}
          onSubmit={(families) => handleSubmit(families)}
          schema={familiesArraySchema}
        />
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
