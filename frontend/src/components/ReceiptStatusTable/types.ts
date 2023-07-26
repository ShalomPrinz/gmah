import type { DriverReceipt } from "../../types";

type FormItem = DriverReceipt;

type FormValues = { [key: string]: FormItem[] };

export type { FormItem, FormValues };
