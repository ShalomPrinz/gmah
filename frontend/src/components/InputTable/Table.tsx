import { FieldArray, Form, Formik } from "formik";
import type { FormikErrors } from "formik";
import { toast } from "react-toastify";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

import type { TableColumn } from "./types";

type TableRow = {
  [key: string]: string;
};

interface InputTableProps {
  columns: TableColumn[];
  data: TableRow[];
  inputsName: string;
  onSubmit: (data: TableRow[]) => Promise<boolean>;
  /** Yup Object Schema with one key value pair: { [inputsName]: data } */
  schema: any;
}

const InputTable = ({
  columns,
  data,
  inputsName,
  onSubmit,
  schema,
}: InputTableProps) => {
  const displayTable = data.length > 0;

  const toastUnknownSubmitError = () =>
    toast.error("קרתה תקלה בהוספת המשפחות", { toastId: "addFamiliesError" });

  const onSubmitResolved = (isSuccess: boolean) => {
    if (isSuccess) {
      toast.success(`הוספת בהצלחה ${data.length} משפחות חדשות לגמ"ח`);
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
      initialValues={{ [inputsName]: data }}
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
            {() => (
              <table className="bg-white">
                <TableHeader columns={columns} display={displayTable} />
                <TableBody
                  columns={columns}
                  inputsName={inputsName}
                  items={data.length}
                />
              </table>
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

export default InputTable;
