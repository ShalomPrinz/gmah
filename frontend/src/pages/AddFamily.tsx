import { toast } from "react-toastify";

import { Form } from "../components";
import { addFamilyInputs, familiesObjectSchema } from "../modules";
import { addFamily } from "../services";

function AddFamily() {
  const handleSubmit = (familyData: any) =>
    addFamily(familyData)
      .then(() => {
        toast.success(`משפחת ${familyData["שם מלא"]} נוספה בהצלחה לגמח:)`);
        return true;
      })
      .catch(() => {
        toast.error(
          "קרתה תקלה ולא הצלחנו להוסיף את המשפחה לגמח. אם הבעיה ממשיכה אנא פנה לשלום"
        );
        return false;
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
