import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { InputTable } from "../components";
import {
  addFamilyHeaders,
  defaultFamily,
  familiesArraySchema,
  familyIdProp,
} from "../modules";
import type { Family, FormFamily } from "../modules";
import { addFamilies } from "../services";
import {
  prepareFamily,
  reverseFamilyPreparation,
  useTableParser,
} from "../util";

function AddManyFamilies() {
  const { parsed, parseCount, parseFromClipboard } = useTableParser(
    toast.error
  );
  const initialTable = (parsed as Family[]).map(prepareFamily);

  const handleSubmit = (formFamilies: FormFamily[]) => {
    const families = formFamilies.map(reverseFamilyPreparation);
    addFamilies(families).then((response) => {
      if (response === "Unexpected") return;
      if (typeof response !== "string") {
        toast.success(`${families.length} משפחות נוספו בהצלחה לגמח`);
        return;
      }

      const index = families.findIndex((f) => f[familyIdProp] === response);
      if (index > 0) {
        toast.info(
          `למרות שהייתה תקלה, כל המשפחות שמופיעות לפני משפחת ${response} בטבלה נוספו לגמ"ח בהצלחה`
        );
      }
    });
  };

  return (
    <>
      <div className="container text-center">
        <h2 className="mt-5 mb-3">הדבק או גרור את טבלת המצטרפים החדשים לגמח</h2>
        <p>
          על מנת להדביק את הטבלה, הקש
          <span className="fw-bold mx-2 fs-5">Ctrl + V</span> או
          <button
            className="bg-default rounded px-3 py-1 me-3"
            onClick={parseFromClipboard}
          >
            לחץ כאן
          </button>
        </p>
        <p>בנוסף, באפשרותך לגרור את הטבלה או את הקובץ</p>
      </div>
      <main className="text-center w-100">
        <InputTable
          columns={addFamilyHeaders}
          defaultItem={defaultFamily}
          initialValues={initialTable}
          formName="families"
          key={parseCount}
          onSubmit={(values) => handleSubmit(values as FormFamily[])}
          schema={familiesArraySchema}
          text={{
            noTable: "- כאן תוכל לערוך את המשפחות לאחר שתדביק את הטבלה -",
            submit: "הוסף משפחות",
          }}
        />
      </main>
    </>
  );
}

export default AddManyFamilies;
