import { toast } from "react-toastify";

import { Form } from "../components";
import { useLocationState } from "../hooks";
import {
  editFamilyInputs,
  editHolidayFamilyInputs,
  familiesObjectSchema,
  familyIdProp,
} from "../modules";
import type { Family, FormFamily } from "../modules";
import { updateFamily, updateHolidayFamily } from "../services";
import { reverseFamilyPreparation } from "../util";

type Input = {
  id: number;
  label: string;
  path: string;
  doubleSize?: boolean;
};

function getInitialFamily(inputs: Input[], family: Family) {
  return inputs.reduce(
    (obj, { label, path }) => ({
      ...obj,
      [path]: family[label as keyof Family] || "",
    }),
    {} as FormFamily
  );
}

const editFamilyProps = {
  regular: {
    inputs: editFamilyInputs,
    updateFunc: updateFamily,
  },
  holiday: {
    inputs: editHolidayFamilyInputs,
    updateFunc: updateHolidayFamily,
  },
};

interface EditFamilyProps {
  familyType: keyof typeof editFamilyProps;
}

function EditFamily({ familyType }: EditFamilyProps) {
  const originalFamily = useLocationState<Family>("EditFamily", "family");
  if (originalFamily === undefined) return <>Error</>;

  const originalName = originalFamily[familyIdProp];
  const { inputs, updateFunc } = editFamilyProps[familyType];

  const handleSubmit = async (formFamily: FormFamily) => {
    const family = reverseFamilyPreparation(formFamily);
    return updateFunc(originalName, family)
      .then(() => {
        toast.success(`שינית את פרטי משפחת ${originalName} בהצלחה`);
        return false;
      })
      .catch(() => {
        toast.error("קרתה תקלה לא צפויה");
        return false;
      });
  };

  const initialFamily = getInitialFamily(inputs, originalFamily);

  return (
    <main className="container my-4 text-center">
      <Form
        initialData={initialFamily}
        inputsInRow="6"
        onSubmit={(values) => handleSubmit(values as FormFamily)}
        schema={familiesObjectSchema}
        submitText="לחץ כאן לאישור"
        textInputs={inputs}
        title={`שינוי פרטים: ${originalName}`}
      />
    </main>
  );
}

export default EditFamily;
