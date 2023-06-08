import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import { useFormForwardContext } from "./FormForwardContext";
import IconComponent from "../Icon";

import type { Icon } from "../../res/icons";
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

  const rowCallback = (rowId: string, rowIndex: number) => {
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
        {columns.map((column, colIndex) =>
          cellCallback(column, colIndex, rowIndex)
        )}
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
  };

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

interface RowButtonProps {
  icon: Icon;
  onClick: () => void;
  style: "red" | "blue";
  text: string;
}

function RowButton({ icon, onClick, style, text }: RowButtonProps) {
  const isStyleRed = style === "red";

  const iconColor = isStyleRed ? "red" : "blue";
  const iconFlip = !isStyleRed;

  const buttonStyle = isStyleRed ? "danger" : "primary";
  const className = `me-2 bg-white text-${buttonStyle} rounded fs-5 border border-3 border-${buttonStyle} button-hover`;

  return (
    <td>
      <button className={className} onClick={onClick} type="button">
        <span className="ps-2">{text}</span>
        <IconComponent
          color={iconColor}
          flipHorizontal={iconFlip}
          icon={icon}
        />
      </button>
    </td>
  );
}

export default TableBody;
