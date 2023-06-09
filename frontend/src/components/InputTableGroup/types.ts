import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";

interface TableColumn {
  id: number;
  label: string;
  path: string;
}

type FormItem = { [key: string]: string };

type FormValues = {
  [key: string]: FormItem[];
};

type FormResetFn = UseFormReset<FormValues>;

type FormSubmitFn = UseFormHandleSubmit<FormValues, undefined>;

export type { FormItem, FormResetFn, FormSubmitFn, FormValues, TableColumn };
