import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import { useFormForwardContext } from "./FormForwardContext";

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
    getValues,
  } = useFormContext();
  const { endForward, isThisForwarding, setForward } = useFormForwardContext();

  function cellCallback({ id, label, path }: TableColumn, rowIndex: number) {
    function getErrorMessage() {
      const dirtyCells = dirtyFields[formName]?.[rowIndex] || {};
      if (Object.keys(dirtyCells).includes(path)) {
        // @ts-ignore errors object at runtime is of different type
        const errorCells = errors[formName]?.[rowIndex] || {};
        if (Object.hasOwn(errorCells, path)) {
          return errorCells[path].message || "שגיאה לא צפויה";
        }
      }
      return undefined;
    }

    return (
      <TableTextInput
        fieldName={`${formName}.${rowIndex}.${path}`}
        getErrorMessage={getErrorMessage}
        key={id}
        title={label}
      />
    );
  }

  function rowCallback(rowId: string, rowIndex: number) {
    const removeFunc = () => {
      remove(rowIndex);
      endForward();
    };
    const rowValue = getValues()?.[formName]?.[rowIndex];
    const origin = { formName, rowIndex };
    const forward = () =>
      setForward({ origin, item: rowValue, removeFromOrigin: removeFunc });

    return (
      <tr key={rowId}>
        <td className="fs-4 fw-bold ps-3">{rowIndex + 1}</td>
        {columns.map((column) => cellCallback(column, rowIndex))}
        <RowButton
          icon="removeItem"
          onClick={removeFunc}
          style="red"
          text="הסר"
        />
        {isThisForwarding(origin) ? (
          <RowButton
            icon="forwardItem"
            onClick={endForward}
            style="red"
            text="בטל"
          />
        ) : (
          <RowButton
            icon="forwardItem"
            onClick={forward}
            style="blue"
            text="העבר"
          />
        )}
      </tr>
    );
  }

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
