import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import { ConditionalList } from "../";
import type { TextInput } from "./FormTextInput";
import { FormTextInput } from "./FormTextInput";

import "./Form.css";

interface FormProps {
  initialData?: {};
  inputsInRow?: "4" | "6";
  onSubmit: (values: {}) => Promise<any>;
  /** Yup Object Schema */
  schema: any;
  submitText?: string;
  textInputs: Array<TextInput>;
  title: string;
}

const AppForm = ({
  initialData,
  inputsInRow,
  onSubmit,
  schema,
  submitText,
  textInputs,
  title,
}: FormProps) => {
  const emptyValues = textInputs.reduce(
    (o, key) => ({ ...o, [key.path]: "" }),
    {}
  );
  const initialValues = initialData || emptyValues;

  // All form methods are required for Form Context Provider
  const formMethods = useForm({
    defaultValues: initialValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    reset,
  } = formMethods;

  function onSubmitInit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(
      (data) => {
        onSubmit(data).then((submitSucceed) => {
          if (submitSucceed) reset(emptyValues);
        });
      },
      (errors) => handleErrorSubmission(errors)
    )();
  }

  function handleErrorSubmission(errors: FieldErrors) {
    if (!errors) {
      toast.error("שגיאה לא צפויה");
      return;
    }

    Object.entries(errors).forEach(([field, error]) => {
      const message = error?.message || "שגיאה לא צפויה";
      const fieldLabel =
        textInputs.find((input) => input.path === field)?.label || field;
      toast.warning(`יש שגיאה ב${fieldLabel}: ${message}`, { toastId: field });
    });
  }

  const inputCallback = (item: TextInput) => {
    function getErrorMessage() {
      const { path } = item;
      if (
        Object.keys(dirtyFields).includes(path) &&
        Object.hasOwn(errors, path)
      ) {
        return errors[path as keyof typeof errors]?.message || "שגיאה לא צפויה";
      }
      return undefined;
    }

    const colMd = inputsInRow === "6" ? (item.doubleSize ? "4" : "2") : "3";
    return (
      <Col md={colMd}>
        <FormTextInput {...item} getErrorMessage={getErrorMessage} />
      </Col>
    );
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmitInit}>
        <Row>
          <h1>{title}</h1>
        </Row>
        <Row className="d-flex justify-content-center">
          <ConditionalList itemCallback={inputCallback} list={textInputs} />
        </Row>
        <Row>
          <button
            className="fs-1 bg-default w-50 mx-auto p-3 mt-5 rounded button-border-focus"
            type="submit"
          >
            {submitText || title}
          </button>
        </Row>
      </form>
    </FormProvider>
  );
};

export default AppForm;
