import { useState } from "react";
import { toast } from "react-toastify";

import {
  TABLE_FORMAT_VALID,
  isString,
  parseTable,
  validateTableFormat,
} from "../util";

function AddManyFamilies() {
  const [table, setTable] = useState<any[]>([]);

  const handlePaste = (event: any) => {
    const parsedTable = parsePastedData(event);
    if (parsedTable) {
      setTable(parsedTable);
    }
  };

  return (
    <main
      className="w-75 my-5 mx-auto p-5 text-center"
      onPaste={handlePaste}
      style={{ border: "1px solid black" }}
    >
      <h2 className="mb-5">הדבק את טבלת המצטרפים החדשים לגמח</h2>
      <pre>{JSON.stringify(table)}</pre>
    </main>
  );
}

function parsePastedData(event: any) {
  const pastedData = event?.clipboardData?.getData("text/plain");
  if (!pastedData || !isString(pastedData)) {
    toast.error("קרתה תקלה בניסיון לקבל את המידע שהודבק");
    return null;
  }

  const validationResult = validateTableFormat(pastedData);
  if (validationResult != TABLE_FORMAT_VALID) {
    toast.error(validationResult);
    return null;
  }

  return parseTable(pastedData);
}

export default AddManyFamilies;
