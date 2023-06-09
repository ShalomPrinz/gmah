import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import RowButton from "../RowButton";
import type { TableColumn } from "./types";

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
  const {
    formState: { errors, dirtyFields },
  } = useFormContext();

  function cellCallback(column: TableColumn, rowIndex: number) {
    function getErrorMessage() {
      const dirtyCells = dirtyFields[formName]?.[rowIndex] || {};
      if (Object.keys(dirtyCells).includes(column.path)) {
        // @ts-ignore errors object at runtime is of different type
        const errorCells = errors[formName]?.[rowIndex] || {};
        if (Object.hasOwn(errorCells, column.path)) {
          return errorCells[column.path].message || "שגיאה לא צפויה";
        }
      }
      return undefined;
    }

    return (
      <TableTextInput
        fieldName={`${formName}.${rowIndex}.${column.path}`}
        getErrorMessage={getErrorMessage}
        key={column.id}
        title={column.path}
      />
    );
  }

  const rowCallback = (rowId: string, rowIndex: number) => (
    <tr key={rowId}>
      <td className="fs-4 fw-bold ps-3">{rowIndex + 1}</td>
      {columns.map((column) => cellCallback(column, rowIndex))}
      <RowButton
        icon="removeItem"
        onClick={() => remove(rowIndex)}
        style="red"
        text="הסר"
      />
    </tr>
  );

  return <tbody>{fields.map(({ id }, index) => rowCallback(id, index))}</tbody>;
};

interface TableTextInputProps {
  fieldName: string;
  getErrorMessage: () => any;
  title: string;
}

function TableTextInput({
  fieldName,
  getErrorMessage,
  title,
}: TableTextInputProps) {
  const { register } = useFormContext();
  const errorMessage = getErrorMessage();
  const hasError = typeof errorMessage !== "undefined";

  return (
    <td className="align-middle">
      <input
        className={`form-text-input p-1 m-1 text-center${
          hasError ? " form-input-invalid" : ""
        }`}
        style={{ maxWidth: "130px" }}
        title={hasError ? errorMessage : title}
        type="text"
        {...register(fieldName)}
      />
    </td>
  );
}

export default TableBody;
