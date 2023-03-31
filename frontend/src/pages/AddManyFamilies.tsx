import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { array, object, string, number } from "yup";

import { InputTable } from "../components";
import {
  TABLE_FORMAT_VALID,
  isString,
  parseTable,
  validateTableFormat,
} from "../util";
import type { ParsedTable } from "../util";

const familyTableHeaders = [
  {
    id: 0,
    path: "שם מלא",
  },
  {
    id: 1,
    path: "רחוב",
  },
  {
    id: 2,
    path: "בניין",
  },
  {
    id: 3,
    path: "דירה",
  },
  {
    id: 4,
    path: "קומה",
  },
  {
    id: 5,
    path: "מס' בית",
  },
  {
    id: 6,
    path: "מס' פלאפון",
  },
  {
    id: 7,
    path: "נהג במקור",
  },
  {
    id: 8,
    path: "ממליץ",
  },
  {
    id: 9,
    path: "הערות",
  },
];

// This regex matches 9 or 10 digits number, and allows hyphen after three digits
const phoneRegExp = /^\d{2,3}-?\d{7}$/;

const schema = object({
  families: array().of(
    object({
      "שם מלא": string().required("אי אפשר להוסיף משפחה ללא שם"),
      רחוב: string(),
      בניין: string(),
      דירה: number().typeError("מספר הדירה צריך להיות מספר"),
      קומה: number().typeError("מספר הקומה צריך להיות מספר"),
      "מס' בית": string().matches(
        phoneRegExp,
        "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
      ),
      "מס' פלאפון": string().matches(
        phoneRegExp,
        "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
      ),
      ממליץ: string(),
      הערות: string(),
    })
  ),
});

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
          columns={familyTableHeaders}
          data={table}
          inputsName="families"
          onSubmit={(families) => handleSubmit(families)}
          schema={schema}
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
