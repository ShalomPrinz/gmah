import { array, object, string, number } from "yup";

/** This regex matches 9 or 10 digits number, and allows hyphen after 2 or 3 digits.
 * It also allows empty string.
 */
const phoneRegExp = /^(?:\d{2,3}-?\d{7}|)$/;

function emptyStringToNull(value: any, originalValue: any) {
  return typeof originalValue === "string" && originalValue === ""
    ? null
    : value;
}

const familiesObjectSchema = object({
  "שם מלא": string().required("המשפחה חייבת להכיל שם"),
  רחוב: string(),
  בניין: string(),
  דירה: number()
    .typeError("מספר הדירה צריך להיות מספר")
    .transform(emptyStringToNull)
    .nullable(),
  קומה: number()
    .typeError("מספר הקומה צריך להיות מספר")
    .transform(emptyStringToNull)
    .nullable(),
  "מס$ בית": string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  "מס$ פלאפון": string().matches(
    phoneRegExp,
    "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות"
  ),
  נהג: string(),
  ממליץ: string(),
  הערות: string(),
});

const familiesArraySchema = object({
  families: array().of(familiesObjectSchema),
});

const driverObjectSchema = object({
  name: string().required("לנהג חייב להיות שם"),
  phone: string()
    .matches(phoneRegExp, "נא להכניס מס' טלפון תקין בעל 9 או 10 ספרות")
    .required("לנהג חייב להיות מס' פלאפון"),
});

const driversArraySchema = (name: string) =>
  object({
    [name]: array().of(driverObjectSchema),
  });

export { driversArraySchema, familiesArraySchema, familiesObjectSchema };
