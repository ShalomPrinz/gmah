import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";

interface TableColumn {
  id: number;
  label: string;
  path: string;
}

type FormItem = { [key: string]: string };

/** title property allows editing [key: string] */
type FormValues = {
  [key: string]: {
    title: string;
    values: FormItem[];
  };
};

type FormResetFn = UseFormReset<FormValues>;
type RegisterReset = (resetFn: FormResetFn) => void;

type FormSubmitFn = UseFormHandleSubmit<FormValues, undefined>;
type RegisterSubmit = (formkey: string, submitFn: FormSubmitFn) => void;

export type {
  FormItem,
  FormResetFn,
  FormSubmitFn,
  FormValues,
  TableColumn,
  RegisterReset,
  RegisterSubmit,
};
