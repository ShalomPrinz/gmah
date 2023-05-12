import { toast } from "react-toastify";

import { Form } from "../components";
import { addFamilyInputs, familiesObjectSchema } from "../modules";
import { addFamilies } from "../services";

function AddFamily() {
  const handleSubmit = (familyData: any) =>
    addFamilies([familyData]).then((response) => {
      if (typeof response !== "string") {
        toast.success(`משפחת ${familyData["שם מלא"]} נוספה בהצלחה לגמח:)`);
        return true;
      }
    });

  return (
    <main className="container my-4 text-center">
      <Form
        onSubmit={handleSubmit}
        schema={familiesObjectSchema}
        textInputs={addFamilyInputs}
        title="הוסף משפחה"
      />
    </main>
  );
}

export default AddFamily;
