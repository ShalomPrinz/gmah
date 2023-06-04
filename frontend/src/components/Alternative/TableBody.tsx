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
  const {
    formState: { errors, dirtyFields },
  } = useFormContext();

  const cellCallback = (
    column: TableColumn,
    colIndex: number,
    rowIndex: number
  ) => {
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
        key={colIndex}
        title={column.label}
      />
    );
  };

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
        style={{ maxWidth: "150px" }}
        title={hasError ? errorMessage : title}
        type="text"
        {...register(fieldName)}
      />
    </td>
  );
}

export default TableBody;
