import {
  FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import IconComponent from "../Icon";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { FormItem, FormValues, TableColumn } from "./types";

interface InputTableProps {
  columns: TableColumn[];
  defaultItem: FormItem;
  initialValues: FormItem[];
  formName: string;
  onSubmit: (values: FormItem[]) => void;
  schema: any;
}

function InputTable({
  columns,
  defaultItem,
  initialValues,
  formName,
  onSubmit,
  schema,
}: InputTableProps) {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      [formName]: initialValues,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // All form methods are required for Form Context Provider
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = formMethods;
  const displayTable = getValues()?.[formName]?.length > 0;
  const fieldArrayMethods = useFieldArray({ name: formName, control });

  function onSubmitInit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(
      (data) => onSubmit(data[formName]),
      (errors) => handleErrorSubmission(errors)
    )();
  }

  function handleErrorSubmission(errors: FieldErrors<FormValues>) {
    if (!errors || !errors[formName] || !Array.isArray(errors[formName])) {
      toast.error("שגיאה לא צפויה");
      return;
    }

    // @ts-ignore typescript doesn't allow forEach here
    errors[formName]?.forEach((familyErrors, index) => {
      familyErrors &&
        Object.entries(familyErrors).forEach(([field, error]) => {
          const message = error?.message || "שגיאה לא צפויה";
          toast.warning(
            `יש שגיאה ב${field} של משפחה מספר ${index + 1}: ${message}`,
            { toastId: `${index}:${field}` }
          );
        });
    });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmitInit}>
        <table className="bg-white mx-auto">
          <TableHeader columns={columns} display={displayTable} />
          <TableBody
            columns={columns}
            fieldArrayMethods={fieldArrayMethods}
            formName={formName}
          />
        </table>
        <button
          className="fs-3 bg-default rounded p-4 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
          onClick={() => fieldArrayMethods.append(defaultItem)}
          type="button"
        >
          <span className="ps-3">הוסף שורה בטבלה</span>
          <IconComponent icon="addFamily" />
        </button>
        {displayTable && (
          <button
            className="fs-3 bg-default rounded m-4 py-3 px-4 button-border-focus"
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
      </form>
    </FormProvider>
  );
}

export default InputTable;
