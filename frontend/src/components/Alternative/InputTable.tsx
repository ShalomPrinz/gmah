import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { FormItem, FormSubmitFn, FormValues, TableColumn } from "./types";

interface InputTableProps {
  columns: TableColumn[];
  defaultItem: FormItem;
  initialValues: FormItem[];
  name: string;
  /** Parent should implement submit functionality */
  registerSubmit: (formkey: string, submitFn: FormSubmitFn) => void;
  schema: any;
}

function InputTable({
  columns,
  defaultItem,
  initialValues,
  name,
  registerSubmit,
  schema,
}: InputTableProps) {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      [name]: initialValues,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // All form methods are required for Form Context Provider
  const { control, handleSubmit } = formMethods;
  const fieldArrayMethods = useFieldArray({ name, control });

  useEffect(() => registerSubmit(name, handleSubmit), []);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <table className="bg-white mx-auto">
          <TableHeader columns={columns} />
          <TableBody
            columns={columns}
            fieldArrayMethods={fieldArrayMethods}
            formName={name}
          />
        </table>
        <button
          className="fs-4 bg-default rounded m-4 py-2 px-4"
          type="button"
          onClick={() => fieldArrayMethods.append(defaultItem)}
        >
          הוסף נהג
        </button>
      </form>
    </FormProvider>
  );
}

export default InputTable;
