import { useField } from "formik";

import type { TableColumn } from "./types";
import IconComponent from "../Icon";

export interface TableBodyProps {
  columns: TableColumn[];
  inputsName: string;
  items: number;
  removeFunc: (index: number) => void;
}

const TableBody = ({
  columns,
  inputsName,
  items,
  removeFunc,
}: TableBodyProps) => {
  const cellCallback = (
    column: TableColumn,
    colIndex: number,
    rowIndex: number
  ) => (
    <TableTextInput
      fieldName={`${inputsName}[${rowIndex}][${column.path}]`}
      key={colIndex}
      title={column.path}
    />
  );

  const rowCallback = (rowIndex: number) => (
    <tr key={rowIndex}>
      <td className="fs-4 fw-bold ps-3">{rowIndex + 1}</td>
      {columns.map((column, colIndex) =>
        cellCallback(column, colIndex, rowIndex)
      )}
      <td>
        <button
          className="me-3 bg-white text-danger rounded fs-5 border border-3 border-danger button-hover"
          onClick={() => removeFunc(rowIndex)}
          type="button"
        >
          <span className="ps-2">הסר</span>
          <IconComponent color="red" icon="removeItem" />
        </button>
      </td>
    </tr>
  );

  return (
    <tbody>{[...Array(items)].map((_, index) => rowCallback(index))}</tbody>
  );
};

interface TableTextInputProps {
  fieldName: string;
  title: string;
}

function TableTextInput({ fieldName, title }: TableTextInputProps) {
  const [field, meta] = useField(fieldName);
  const hasError = meta.touched && meta.error;

  return (
    <td className="align-middle">
      <input
        className={`form-text-input p-1 m-1 text-center${
          hasError ? " form-input-invalid" : ""
        }`}
        style={{ maxWidth: "130px" }}
        title={hasError ? meta.error : title}
        type="text"
        {...field}
      />
    </td>
  );
}

export default TableBody;
