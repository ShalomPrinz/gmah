import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { InputTable } from "../components";
import {
  addFamilyHeaders,
  familiesArraySchema,
  familyIdProp,
} from "../modules";
import { addFamilies } from "../services";
import { useTableParser } from "../util";

const original = "'";
const valid = "$";

const prepareKey = (key: string) => key.replace(original, valid);
const reverseKeyPreparation = (key: string) => key.replace(valid, original);

const transform = (family: any, func: (key: string) => string) =>
  Object.entries(family).reduce(
    (acc, [key, value]) => ({ ...acc, [func(key)]: value }),
    {}
  );

const prepareFamilyKeys = (family: any) => transform(family, prepareKey);
const reverseFamilyPreparation = (family: any) =>
  transform(family, reverseKeyPreparation);

const columns = addFamilyHeaders.map(({ id, path }) => ({
  id,
  label: path,
  path: prepareKey(path),
}));

const defaultItem = columns.reduce((obj: { [key: string]: string }, header) => {
  obj[header.path] = "";
  return obj;
}, {});

function AddManyFamilies() {
  const { parsed, parseCount, parseFromClipboard } = useTableParser(
    toast.error
  );
  const initialTable = parsed.map(prepareFamilyKeys);

  const handleSubmit = (families: any[]) => {
    const reversedKeysFamilies = families.map(reverseFamilyPreparation);
    addFamilies(reversedKeysFamilies).then((response) => {
      if (response === "Unexpected") return;
      if (typeof response !== "string") {
        toast.success(`${families.length} משפחות נוספו בהצלחה לגמח`);
        return;
      }

      const index = families.findIndex((f) => f[familyIdProp] === response);
      if (index > 0) {
        toast.info(
          `למרות שהייתה תקלה, כל המשפחות שמופיעות לפני משפחת ${response} בטבלה נוספו לגמ"ח בהצלחה`
        );
      }
    });
  };

  return (
    <>
      <div className="container text-center">
        <Row>
          <h2 className="mt-5 mb-3">
            הדבק או גרור את טבלת המצטרפים החדשים לגמח
          </h2>
        </Row>
        <Row>
          <Col>
            <p>
              על מנת להדביק את הטבלה, הקש{" "}
              <span className="fw-bold mx-2 fs-5">Ctrl + V</span> או{" "}
              <button
                className="bg-default rounded px-3 py-1 me-2"
                onClick={parseFromClipboard}
              >
                לחץ כאן
              </button>
            </p>
            <p>
              <span className="fw-bold fs-5">שים לב: </span>
              אתה צריך להעתיק את כל הטבלה, כולל את שורת הכותרות
            </p>
          </Col>
          <Col>
            <p>
              על מנת לגרור את הטבלה, בחר אותה בוורד וגרור אותה לעמוד. בנוסף,
              באפשרותך לגרור את הקובץ עצמו במקום לפתוח אותו ולבחור את הטבלה
            </p>
            <p>
              <span className="fw-bold fs-5">שים לב: </span>
              תוודא שהכותרות בקובץ לא השתנו והם תואמות את הכותרות הקבועות
            </p>
          </Col>
        </Row>
      </div>
      <main className="text-center w-100">
        <InputTable
          columns={columns}
          defaultItem={defaultItem}
          initialValues={initialTable}
          formName="families"
          key={parseCount}
          onSubmit={handleSubmit}
          schema={familiesArraySchema}
        />
      </main>
    </>
  );
}

export default AddManyFamilies;
