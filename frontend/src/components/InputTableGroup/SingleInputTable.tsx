import { useEffect } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useFormForwardContext } from "./FormForwardContext";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type {
  FormItem,
  FormValues,
  RegisterReset,
  RegisterSubmit,
  TableColumn,
} from "./types";
import type { NonEmptyString } from "../../types";

interface SingleInputTableProps {
  columns: TableColumn[];
  defaultItem: FormItem;
  initialValues: FormItem[];
  formName: NonEmptyString;
  /** Parent should implement reset functionality */
  registerReset: RegisterReset;
  /** Parent should implement submit functionality */
  registerSubmit: RegisterSubmit;
  schema: any;
  titleDescription: string;
}

function SingleInputTable({
  columns,
  defaultItem,
  initialValues,
  formName,
  registerReset,
  registerSubmit,
  schema,
  titleDescription,
}: SingleInputTableProps) {
  const name = formName as string;
  const formMethods = useForm<FormValues>({
    defaultValues: {
      [name]: {
        title: name,
        values: initialValues,
      },
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // All form methods are required for Form Context Provider
  const { control, handleSubmit, reset } = formMethods;
  const fieldArrayMethods = useFieldArray({ name: `${name}.values`, control });

  useEffect(() => {
    registerSubmit(name, handleSubmit);
    registerReset(reset);
  }, []);

  const { appendButtonDisabled, appendButtonText, handleAppendItem } =
    useAppendButton({
      appendFunc: fieldArrayMethods.append,
      defaultItem,
      formName: name,
    });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TitleInput formName={name} titleDescription={titleDescription} />
        <table className="bg-white mx-auto">
          <TableHeader columns={columns} />
          <TableBody
            columns={columns}
            fieldArrayMethods={fieldArrayMethods}
            formName={name}
          />
        </table>
        <button
          className="fs-4 bg-default rounded m-4 py-2 px-4"
          disabled={appendButtonDisabled}
          type="button"
          onClick={handleAppendItem}
        >
          {appendButtonText}
        </button>
      </form>
    </FormProvider>
  );
}

interface TitleInputProps {
  formName: string;
  titleDescription: string;
}

function TitleInput({ formName, titleDescription }: TitleInputProps) {
  const {
    formState: { dirtyFields, errors },
    register,
  } = useFormContext();

  function getErrorMessage() {
    const isDirty = dirtyFields[formName]?.title || false;
    if (!isDirty) return undefined;
    // @ts-ignore errors object at runtime is of different type
    const error = errors[formName]?.title || undefined;
    if (typeof error === "undefined") return undefined;
    return error.message || "שגיאה לא צפויה";
  }

  const errorMessage = getErrorMessage();
  const hasError = typeof errorMessage !== "undefined";

  return (
    <input
      className={`fs-2 w-50 text-center form-text-input${
        hasError ? " form-input-invalid" : " border border-3 border-primary"
      }`}
      title={hasError ? errorMessage : titleDescription}
      type="text"
      {...register(`${formName}.title`)}
    />
  );
}

interface UseAppendButtonProps {
  appendFunc: (itemToAppend: FormItem) => void;
  defaultItem: FormItem;
  formName: string;
}

function useAppendButton({
  appendFunc,
  defaultItem,
  formName,
}: UseAppendButtonProps) {
  const { getForward, isForwarding, isThisForwarding } =
    useFormForwardContext();

  const forward = getForward();
  let itemToAppend = forward?.item || defaultItem;
  let handleAppendItem = () => {
    appendFunc(itemToAppend);
    forward?.removeFromOrigin();
  };

  let appendButtonText = "הוסף נהג";
  let appendButtonDisabled = false;
  if (isThisForwarding({ formName })) {
    appendButtonDisabled = true;
  } else if (isForwarding()) {
    appendButtonText = `העבר ל${formName}`;
  }

  return {
    appendButtonDisabled,
    appendButtonText,
    handleAppendItem,
  };
}

export default SingleInputTable;
