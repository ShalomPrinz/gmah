import { toast } from "react-toastify";

import { Form } from "../components";
import {
  addFamilyHeaders,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { FormFamily } from "../modules";
import { addFamilies } from "../services";
import { reverseFamilyPreparation } from "../util";

function AddFamily() {
  const handleSubmit = async (formFamily: FormFamily) => {
    const family = reverseFamilyPreparation(formFamily);
    return addFamilies([family]).then((response) => {
      if (typeof response !== "string") {
        toast.success(`משפחת ${family[familyIdProp]} נוספה בהצלחה לגמח:)`);
        return true;
      }
    });
  };

  return (
    <main className="container my-4 text-center">
      <Form
        onSubmit={(values) => handleSubmit(values as FormFamily)}
        schema={familiesObjectSchema}
        textInputs={addFamilyHeaders}
        title="הוסף משפחה"
      />
    </main>
  );
}

export default AddFamily;
