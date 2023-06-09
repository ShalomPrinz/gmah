interface TableColumn {
  id: number;
  label?: string;
  path: string;
}

type FormItem = { [key: string]: string };

type FormValues = {
  [key: string]: FormItem[];
};

export type { FormItem, FormValues, TableColumn };
