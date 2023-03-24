import { useField } from "formik";

export type TextInput = {
  label: string;
  name: string;
  placeholder?: string;
  type: string;
};

interface FormTextInputProps {
  name: string;
  type: string;
  [x: string]: string;
}

export const FormTextInput = ({ label, ...props }: FormTextInputProps) => {
  const [field, meta] = useField(props);
  return (
    <div className="d-flex flex-column">
      <label className="fs-5" htmlFor={props.name}>
        {label}
      </label>
      <input className="form-text-input p-2 m-3 mb-2" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};
