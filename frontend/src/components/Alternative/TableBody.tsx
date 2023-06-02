import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import type { TableColumn } from "./types";
import IconComponent from "../Icon";

export interface TableBodyProps {
  columns: TableColumn[];
  fieldArrayMethods: UseFieldArrayReturn;
  formName: string;
}

const TableBody = ({
  columns,
  fieldArrayMethods,
  formName,
}: TableBodyProps) => {
  const { fields, remove } = fieldArrayMethods;

  const cellCallback = (
    column: TableColumn,
    colIndex: number,
    rowIndex: number
  ) => (
    <TableTextInput
      fieldName={`${formName}.${rowIndex}.${column.path}`}
      key={colIndex}
      title={column.label}
    />
  );

  const rowCallback = (rowId: string, rowIndex: number) => (
    <tr key={rowId}>
      <td className="fs-4 fw-bold ps-3">{rowIndex + 1}</td>
      {columns.map((column, colIndex) =>
        cellCallback(column, colIndex, rowIndex)
      )}
      <td>
        <button
          className="me-3 bg-white text-danger rounded fs-5 border border-3 border-danger button-hover"
          onClick={() => remove(rowIndex)}
          type="button"
        >
          <span className="ps-2">הסר</span>
          <IconComponent color="red" icon="removeItem" />
        </button>
      </td>
    </tr>
  );

  return <tbody>{fields.map(({ id }, index) => rowCallback(id, index))}</tbody>;
};

interface TableTextInputProps {
  fieldName: string;
  title: string;
}

function TableTextInput({ fieldName, title }: TableTextInputProps) {
  const { register } = useFormContext();

  return (
    <td className="align-middle">
      <input
        className={`form-text-input p-1 m-1 text-center`}
        style={{ maxWidth: "150px" }}
        title={title}
        type="text"
        {...register(fieldName)}
      />
    </td>
  );
}

export default TableBody;
