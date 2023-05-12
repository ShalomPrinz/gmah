import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { InputTable } from "../components";
import { addFamilyHeaders, familiesArraySchema } from "../modules";
import { addFamilies } from "../services";
import { useTableParser } from "../util";

const emptyItem = addFamilyHeaders.reduce(
  (obj: { [key: string]: string }, header) => {
    obj[header.path] = "";
    return obj;
  },
  {}
);

function AddManyFamilies() {
  const {
    parsed: initialTable,
    parseCount,
    parseFromClipboard,
  } = useTableParser(toast.error);

  const handleSubmit = (families: any[]) =>
    addFamilies(families)
      .then(() => {
        toast.success(`${families.length} משפחות נוספו בהצלחה לגמח:)`);
      })
      .catch(() => {
        toast.error(
          "קרתה תקלה ולא הצלחנו להוסיף את המשפחות לגמח. אם הבעיה ממשיכה אנא פנה לשלום"
        );
      });

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
          columns={addFamilyHeaders}
          emptyItem={emptyItem}
          initialData={initialTable}
          inputsName="families"
          key={parseCount}
          onSubmit={(families) => handleSubmit(families)}
          schema={familiesArraySchema}
        />
      </main>
    </>
  );
}

export default AddManyFamilies;
