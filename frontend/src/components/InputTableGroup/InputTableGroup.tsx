import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useFormForwardContext } from "./FormForwardContext";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type {
  FormItem,
  FormResetFn,
  FormSubmitFn,
  FormValues,
  TableColumn,
} from "./types";
import type { NonEmptyString } from "../../types";

interface InputTableGroupProps {
  columns: TableColumn[];
  defaultItem: FormItem;
  initialValues: FormItem[];
  formName: NonEmptyString;
  /** Parent should implement submit and reset functionality */
  registerReset: (resetFn: FormResetFn) => void;
  registerSubmit: (formkey: string, submitFn: FormSubmitFn) => void;
  schema: any;
}

/** Must be used inside of a FormForwardContext */
function InputTableGroup({
  columns,
  defaultItem,
  initialValues,
  formName,
  registerReset,
  registerSubmit,
  schema,
}: InputTableGroupProps) {
  const name = formName as string;
  const formMethods = useForm<FormValues>({
    defaultValues: {
      [name]: initialValues,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // All form methods are required for Form Context Provider
  const { control, handleSubmit, reset } = formMethods;
  const fieldArrayMethods = useFieldArray({ name: name, control });

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

export default InputTableGroup;
