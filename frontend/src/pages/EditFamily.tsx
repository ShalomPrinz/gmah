import { toast } from "react-toastify";

import { Form } from "../components";
import { useLocationState } from "../hooks";
import {
  editFamilyInputs,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { Family, FormFamily } from "../modules";
import { updateFamily } from "../services";
import { reverseFamilyPreparation } from "../util";

function getInitialFamily(family: Family) {
  return editFamilyInputs.reduce(
    (obj, { label, path }) => ({
      ...obj,
      [path]: family[label as keyof Family] || "",
    }),
    {} as FormFamily
  );
}

function EditFamily() {
  const originalFamily = useLocationState<Family>("EditFamily", "family");
  if (originalFamily === undefined) return <>Error</>;

  const originalName = originalFamily[familyIdProp];

  const handleSubmit = async (formFamily: FormFamily) => {
    const family = reverseFamilyPreparation(formFamily);
    return updateFamily(originalName, family)
      .then(() => {
        toast.success(`שינית את פרטי משפחת ${originalName} בהצלחה`);
        return false;
      })
      .catch(() => {
        toast.error("קרתה תקלה לא צפויה");
        return false;
      });
  };

  const initialFamily = getInitialFamily(originalFamily);

  return (
    <main className="container my-4 text-center">
      <Form
        initialData={initialFamily}
        inputsInRow="6"
        onSubmit={(values) => handleSubmit(values as FormFamily)}
        schema={familiesObjectSchema}
        submitText="לחץ כאן לאישור"
        textInputs={editFamilyInputs}
        title={`שינוי פרטים: ${originalName}`}
      />
    </main>
  );
}

export default EditFamily;
