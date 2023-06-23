import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { Form } from "../components";
import {
  editFamilyInputs,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { Family } from "../modules";
import { updateFamily } from "../services";

function EditFamily() {
  const originalData = useLocationState();
  if (originalData === undefined) return <>Error</>;

  const originalName = originalData[familyIdProp];

  const handleSubmit = (family: Family) =>
    updateFamily(originalName, family)
      .then(() => {
        toast.success(`שינית את פרטי משפחת ${originalName} בהצלחה`);
        return false;
      })
      .catch(() => {
        toast.error("קרתה תקלה לא צפויה");
        return false;
      });

  const initialData = editFamilyInputs.reduce((o, key) => {
    const familyKey = key.name as keyof Family;
    return {
      ...o,
      [familyKey]: originalData[familyKey] || "",
    };
  }, {} as Family);

  return (
    <main className="container my-4 text-center">
      <Form
        initialData={initialData}
        onSubmit={(values) => handleSubmit(values as Family)}
        schema={familiesObjectSchema}
        submitText="לחץ כאן לאישור"
        textInputs={editFamilyInputs}
        title={`שינוי פרטים: ${originalName}`}
      />
    </main>
  );
}

function useLocationState() {
  const { state } = useLocation();
  if (state && state.family) {
    return state.family as Family;
  }

  toast.error("יש בעיה בדרך בה הגעת לעמוד הזה. אם הבעיה חוזרת פנה לשלום", {
    toastId: 1,
  });
  return undefined;
}

export default EditFamily;
