import { toast } from "react-toastify";

import { Form } from "../components";
import {
  addFamilyInputs,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { Family } from "../modules";
import { addFamilies } from "../services";

function AddFamily() {
  const handleSubmit = (family: Family) =>
    addFamilies([family]).then((response) => {
      if (typeof response !== "string") {
        toast.success(`משפחת ${family[familyIdProp]} נוספה בהצלחה לגמח:)`);
        return true;
      }
    });

  return (
    <main className="container my-4 text-center">
      <Form
        onSubmit={(values) => handleSubmit(values as Family)}
        schema={familiesObjectSchema}
        textInputs={addFamilyInputs}
        title="הוסף משפחה"
      />
    </main>
  );
}

export default AddFamily;
