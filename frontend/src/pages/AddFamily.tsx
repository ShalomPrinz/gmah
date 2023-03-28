import { toast } from "react-toastify";
import { object, string, number } from "yup";

import { Form } from "../components";
import { addFamily } from "../services";

// This regex matches 9 or 10 digits number, and allows hyphen after three digits
const phoneRegExp = /^\d{2,3}-?\d{7}$/;

const schema = object({
  "שם מלא": string().required("אי אפשר להוסיף משפחה ללא שם"),
  רחוב: string(),
  בניין: string(),
  דירה: number().typeError("מספר הדירה צריך להיות מספר"),
  קומה: number().typeError("מספר הקומה צריך להיות מספר"),
  "מס' בית": string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  "מס' פלאפון": string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  ממליץ: string(),
  הערות: string(),
});

const textInputs = [
  {
    id: 0,
    name: "שם מלא",
  },
  {
    id: 1,
    name: "רחוב",
  },
  {
    id: 2,
    name: "בניין",
  },
  {
    id: 3,
    name: "דירה",
  },
  {
    id: 4,
    name: "קומה",
  },
  {
    id: 5,
    name: "מס' בית",
  },
  {
    id: 6,
    name: "מס' פלאפון",
  },
  {
    id: 7,
    name: "ממליץ",
  },
  {
    id: 8,
    name: "הערות",
  },
];

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
        schema={schema}
        textInputs={textInputs}
        title="הוסף משפחה"
      />
    </main>
  );
}

export default AddFamily;
