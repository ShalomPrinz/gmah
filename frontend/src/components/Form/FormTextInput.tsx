import { useFormContext } from "react-hook-form";

export interface TextInput {
  doubleSize?: boolean;
  label: string;
  path: string;
}

interface FormTextInputProps extends TextInput {
  getErrorMessage: () => any;
}

export const FormTextInput = ({
  getErrorMessage,
  label,
  path,
}: FormTextInputProps) => {
  const { register } = useFormContext();
  const errorMessage = getErrorMessage();
  const hasError = typeof errorMessage !== "undefined";

  return (
    <div className="d-flex flex-column my-3">
      <label className="fs-4 fw-bold my-2" htmlFor={path}>
        {label}
      </label>
      <input
        className={`fs-5 form-text-input p-1 m-1 text-center${
          hasError ? " form-input-invalid" : ""
        }`}
        title={hasError ? errorMessage : label}
        type="text"
        {...register(path)}
      />
    </div>
  );
};
