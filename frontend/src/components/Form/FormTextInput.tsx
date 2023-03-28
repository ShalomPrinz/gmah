import { useField } from "formik";

export type TextInput = {
  name: string;
};

interface FormTextInputProps {
  name: string;
}

export const FormTextInput = ({ name }: FormTextInputProps) => {
  const [field, meta] = useField(name);
  return (
    <div className="d-flex flex-column">
      <label className="fs-5" htmlFor={name}>
        {name}
      </label>
      <input
        className="form-text-input p-2 m-3 mb-2"
        type="text"
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};
