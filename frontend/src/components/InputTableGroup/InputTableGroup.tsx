import ConditionalList from "../ConditionalList";
import { FormGroupForwardProvider } from "./FormForwardContext";

interface InputTableGroupProps<T> {
  tables: T[];
  tableCallback: (table: T) => JSX.Element;
}

function InputTableGroup<T extends {}>({
  tableCallback,
  tables,
}: InputTableGroupProps<T>) {
  return (
    <FormGroupForwardProvider>
      <ConditionalList list={tables} itemCallback={tableCallback} />
    </FormGroupForwardProvider>
  );
}

export default InputTableGroup;
