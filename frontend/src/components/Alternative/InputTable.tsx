import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { TableColumn } from "./types";

type Item = { [key: string]: string };

type FormValues = {
  [key: string]: Item[];
};

interface InputTableProps {
  columns: TableColumn[];
  defaultItem: Item;
  initialValues: Item[];
  name: string;
}

function InputTable({
  columns,
  defaultItem,
  initialValues,
  name,
}: InputTableProps) {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      [name]: initialValues,
    },
  });

  // All form methods are required for Form Context Provider
  const { control, handleSubmit } = formMethods;
  const fieldArrayMethods = useFieldArray({ name, control });

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
