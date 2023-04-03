import { array, object, string, number } from "yup";

/** This regex matches 9 or 10 digits number, and allows hyphen after 2 or 3 digits */
const phoneRegExp = /^\d{2,3}-?\d{7}$/;

const familiesObjectSchema = object({
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

const familiesArraySchema = object({
  families: array().of(familiesObjectSchema),
});

export { familiesArraySchema, familiesObjectSchema };
