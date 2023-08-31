import { toast } from "react-toastify";
import BsForm from "react-bootstrap/Form";

import { Form } from "../components";
import {
  addFamilyHeaders,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { FormFamily } from "../modules";
import { addFamilies } from "../services";
import { reverseFamilyPreparation } from "../util";
import { useReportContext } from "../contexts";
import { useRef } from "react";

const title = "הוסף משפחה";

function AddFamily() {
  const monthInsertRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (formFamily: FormFamily) => {
    const family = reverseFamilyPreparation(formFamily);
    const monthInsert = monthInsertRef.current?.checked || false;

    return addFamilies([family], monthInsert).then((response) => {
      if (typeof response !== "string") {
        toast.success(`משפחת ${family[familyIdProp]} נוספה בהצלחה לגמח:)`);
        return true;
      }
    });
  };

  function FormTitle() {
    const { activeReport } = useReportContext();
    return (
      <div className="d-flex justify-content-center">
        <h1 className="ms-5">הוסף משפחה</h1>
        <span className="fs-4 my-auto">
          הוסף לחודש הנוכחי: <strong>{activeReport}</strong>
        </span>
        <BsForm.Switch
          className="fs-3 my-auto me-2"
          title={title}
          ref={monthInsertRef}
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
    );
  }

  return (
    <main className="container my-4 text-center">
      <Form
        CustomTitle={<FormTitle />}
        onSubmit={(values) => handleSubmit(values as FormFamily)}
        schema={familiesObjectSchema}
        textInputs={addFamilyHeaders}
        title={title}
      />
    </main>
  );
}

export default AddFamily;
