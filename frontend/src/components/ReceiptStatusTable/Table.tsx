import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { FormItem, FormValues } from "./types";
import { prepareKey } from "../../util";

interface ReceiptStatusTableProps {
  initialValues: FormItem[];
  formName: string;
  onSubmit: (values: FormItem[]) => void;
}

function ReceiptStatusTable({
  formName,
  initialValues,
  onSubmit,
}: ReceiptStatusTableProps) {
  const name = prepareKey(formName);
  const defaultValues = {
    [name]: initialValues,
  };

  const formMethods = useForm<FormValues>({
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => formMethods.reset(defaultValues), [name, initialValues]);

  // All form methods are required for Form Context Provider
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    reset,
  } = formMethods;

  const { fields } = useFieldArray({
    name: name,
    control,
  });

  function setAllStatuses(status: boolean) {
    const newFormState = getValues()[name].map((receipt) => ({
      ...receipt,
      status,
    }));
    reset({ [name]: newFormState });
  }

  function setAllDates(date: string) {
    const newFormState = getValues()[name].map((receipt) => ({
      ...receipt,
      date,
    }));
    reset({ [name]: newFormState });
  }

  function onSubmitInit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit((data) => onSubmit(data[name]))();
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmitInit}>
        <h2 className="d-flex justify-content-between">
          <span className="fs-1 fw-bold bottom-border">{formName}</span>
          <button
            className="bg-default fs-4 rounded mx-5 px-3 py-2"
            disabled={isSubmitting}
            type="submit"
          >
            שמור שינויים
          </button>
        </h2>
        <table className="table rounded bg-white">
          <TableHeader
            key={formName}
            setAllDates={setAllDates}
            setAllStatuses={setAllStatuses}
          />
          <TableBody fields={fields} formName={name} />
        </table>
      </form>
    </FormProvider>
  );
}

export default ReceiptStatusTable;
