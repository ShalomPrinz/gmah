import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { Form } from "../components";
import {
  editFamilyInputs,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import { updateFamily } from "../services";

function EditFamily() {
  const originalData = useLocationState();
  if (originalData === undefined) return <>Error</>;

  const originalName = originalData[familyIdProp];

  const handleSubmit = (familyData: any) =>
    updateFamily(originalName, familyData)
      .then(() => {
        toast.success(`שינית את פרטי משפחת ${originalName} בהצלחה`);
        return false;
      })
      .catch(() => {
        toast.error("קרתה תקלה לא צפויה");
        return false;
      });

  const initialData = editFamilyInputs.reduce(
    (o, key) => ({ ...o, [key.name]: originalData[key.name] || "" }),
    {}
  );

  return (
    <main className="container my-4 text-center">
      <Form
        initialData={initialData}
        onSubmit={handleSubmit}
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
  if (state && state.item) {
    return state.item;
  }

  toast.error("יש בעיה בדרך בה הגעת לעמוד הזה. אם הבעיה חוזרת פנה לשלום", {
    toastId: 1,
  });
  return undefined;
}

export default EditFamily;
