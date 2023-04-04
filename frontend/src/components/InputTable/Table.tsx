import { FieldArray, Form, Formik } from "formik";
import type { FormikErrors } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

import type { TableColumn } from "./types";
import IconComponent from "../Icon";

type TableRow = {
  [key: string]: string;
};

interface InputTableProps {
  columns: TableColumn[];
  /** Used for adding item to the table */
  emptyItem: TableRow;
  initialData: TableRow[];
  inputsName: string;
  onSubmit: (data: TableRow[]) => Promise<boolean>;
  /** Yup Object Schema with one key value pair: { [inputsName]: data } */
  schema: any;
}

const InputTable = ({
  columns,
  emptyItem,
  initialData,
  inputsName,
  onSubmit,
  schema,
}: InputTableProps) => {
  const { itemsCount, addItem, removeItem } = useItemsCount(
    initialData.length,
    emptyItem
  );
  const displayTable = itemsCount > 0;

  const toastUnknownSubmitError = () =>
    toast.error("קרתה תקלה בהוספת המשפחות", { toastId: "addFamiliesError" });

  const onSubmitResolved = (isSuccess: boolean) => {
    if (isSuccess) {
      toast.success(`הוספת בהצלחה ${itemsCount} משפחות חדשות לגמ"ח`);
    } else {
      toastUnknownSubmitError();
    }
  };

  function handleErrorSubmission(
    errors: FormikErrors<{ [x: string]: TableRow[] }>
  ) {
    if (!errors || !errors[inputsName] || !Array.isArray(errors[inputsName]))
      return;

    const errorsArray = errors[inputsName] as TableRow[];
    errorsArray.forEach((familyErrors, index) => {
      familyErrors &&
        Object.entries(familyErrors).forEach(([field, message]) =>
          toast.warning(
            `יש שגיאה ב${field} של משפחה מספר ${index + 1}: ${message}`,
            { toastId: `${index}:${field}` }
          )
        );
    });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ [inputsName]: initialData }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onSubmit(values[inputsName])
          .then((isSuccess) => onSubmitResolved(isSuccess))
          .catch(() => toastUnknownSubmitError())
          .finally(() => setSubmitting(false));
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form onSubmitCapture={() => handleErrorSubmission(errors)}>
          <FieldArray name={inputsName}>
            {({ push, remove }) => (
              <>
                <table className="bg-white">
                  <TableHeader columns={columns} display={displayTable} />
                  <TableBody
                    columns={columns}
                    inputsName={inputsName}
                    items={itemsCount}
                    removeFunc={(index: number) => removeItem(remove, index)}
                  />
                </table>
                <button
                  className="fs-3 bg-default rounded p-4 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
                  onClick={() => addItem(push)}
                  type="button"
                >
                  <span className="ps-3">הוסף שורה בטבלה</span>
                  <IconComponent icon="addFamily" />
                </button>
              </>
            )}
          </FieldArray>
          {isSubmitting && (
            <span className="fs-4">הוספת המשפחות מתבצעת כעת, אנא המתן...</span>
          )}
          {displayTable && (
            <button
              className="bg-default p-4 rounded fs-3 button-border-focus m-5"
              disabled={isSubmitting}
              type="submit"
            >
              הוסף משפחות
            </button>
          )}
          {!displayTable && (
            <h1 className="mt-5 pt-4 fw-light">
              - כאן תוכל לערוך את המשפחות לאחר שתדביק את הטבלה -
            </h1>
          )}
        </Form>
      )}
    </Formik>
  );
};

function useItemsCount(initialCount: number, emptyItem: TableRow) {
  const [itemsCount, setItemsCount] = useState(initialCount);

  useEffect(() => setItemsCount(initialCount), [initialCount]);

  const addItem = (pushFunc: (obj: any) => void) => {
    pushFunc(emptyItem);
    setItemsCount((count) => count + 1);
  };

  const removeItem = (removeFunc: (index: number) => void, index: number) => {
    removeFunc(index);
    setItemsCount((count) => count - 1);
  };

  return { itemsCount, addItem, removeItem };
}

export default InputTable;
