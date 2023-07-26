import Form from "react-bootstrap/Form";
import { useFormContext } from "react-hook-form";
import type { FieldArrayWithId } from "react-hook-form";

import type { FormValues } from "./types";

export interface TableBodyProps {
  fields: FieldArrayWithId<FormValues, string, "id">[];
  formName: string;
}

function TableBody({ fields, formName }: TableBodyProps) {
  return (
    <tbody>
      {fields.map(({ id, name }, index) => (
        <tr key={id}>
          <td className="align-middle text-end pe-5">{name}</td>
          <TableDateInput
            fieldName={`${formName}.${index}.date`}
            title="תאריך"
          />
          <TableSwitchInput
            fieldName={`${formName}.${index}.status`}
            title="סטטוס"
          />
        </tr>
      ))}
    </tbody>
  );
}

interface TableDateInputProps {
  fieldName: string;
  title: string;
}

function TableDateInput({ fieldName, title }: TableDateInputProps) {
  const { register } = useFormContext();

  return (
    <td>
      <input
        className="rounded p-1 m-1 text-center"
        title={title}
        type="date"
        {...register(fieldName)}
      />
    </td>
  );
}

interface TableSwitchInputProps {
  fieldName: string;
  title: string;
}

function TableSwitchInput({ fieldName, title }: TableSwitchInputProps) {
  const { register } = useFormContext();

  return (
    <td>
      <Form.Switch
        className="fs-3"
        title={title}
        style={{ transform: "scaleX(-1)" }}
        {...register(fieldName)}
      />
    </td>
  );
}

export default TableBody;
