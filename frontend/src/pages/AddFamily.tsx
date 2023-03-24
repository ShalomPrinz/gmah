import { toast } from "react-toastify";
import { object, string, number } from "yup";

import { Form } from "../components";
import { addFamily } from "../services";

// This regex matches 9 or 10 digits number, and allows hyphen after three digits
const phoneRegExp = /^\d{9,10}$|^\d{3}-\d{6,7}$/;

const schema = object({
  fullName: string().required("אי אפשר להוסיף משפחה ללא שם"),
  street: string(),
  house: string(),
  apartmentNumber: number().typeError("מספר הדירה צריך להיות מספר"),
  floor: number().typeError("מספר הקומה צריך להיות מספר"),
  homePhone: string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  mobilePhone: string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  referrer: string(),
  notes: string(),
});

const textInputs = [
  {
    id: 0,
    label: "שם מלא",
    name: "fullName",
    type: "text",
  },
  {
    id: 1,
    label: "רחוב",
    name: "street",
    type: "text",
  },
  {
    id: 2,
    label: "בניין",
    name: "house",
    type: "text",
  },
  {
    id: 3,
    label: "דירה",
    name: "apartmentNumber",
    type: "text",
  },
  {
    id: 4,
    label: "קומה",
    name: "floor",
    type: "text",
  },
  {
    id: 5,
    label: "מס' בית",
    name: "homePhone",
    type: "text",
  },
  {
    id: 6,
    label: "מס' פלאפון",
    name: "mobilePhone",
    type: "text",
  },
  {
    id: 7,
    label: "ממליץ",
    name: "referrer",
    type: "text",
  },
  {
    id: 8,
    label: "הערות",
    name: "notes",
    type: "text",
  },
];

function AddFamily() {
  const handleSubmit = (familyData: any) =>
    addFamily(familyData)
      .then(() => {
        toast.success(`משפחת ${familyData.fullName} נוספה בהצלחה לגמח:)`);
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
        schema={schema}
        textInputs={textInputs}
        title="הוסף משפחה"
      />
    </main>
  );
}

export default AddFamily;
