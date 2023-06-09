import { createContext, ReactNode, useContext, useState } from "react";

import { FormItem } from "./types";

type OriginID = {
  formName: string;
  rowIndex?: number;
};

type ForwardValue = {
  origin: OriginID;
  item: FormItem;
  removeFromOrigin: () => void;
};

type FormForwardValue = {
  endForward: () => void;
  getForward: () => ForwardValue | undefined;
  isForwarding: () => boolean;
  isThisForwarding: (origin: OriginID) => boolean;
  setForward: (value: ForwardValue) => void;
};

const FormForwardContext = createContext<FormForwardValue | undefined>(
  undefined
);

function useFormForwardContext() {
  const form = useContext(FormForwardContext);
  if (typeof form === "undefined")
    throw new Error(
      "useFormForwardContext must be used within a FormForwardProvider"
    );
  return form;
}

interface FormForwardProviderProps {
  children: ReactNode;
}

function FormGroupForwardProvider({ children }: FormForwardProviderProps) {
  const [forwardValue, setForwardValue] = useState<ForwardValue | undefined>(
    undefined
  );

  function setForward(value: ForwardValue) {
    setForwardValue(value);
  }

  function getForward() {
    return forwardValue;
  }

  function endForward() {
    setForwardValue(undefined);
  }

  function isForwarding() {
    return typeof forwardValue !== "undefined";
  }

  function isThisForwarding(origin: OriginID) {
    const isThisFormForwarding =
      isForwarding() && forwardValue?.origin.formName === origin.formName;

    if (isThisFormForwarding && typeof origin.rowIndex !== "undefined")
      return forwardValue.origin.rowIndex === origin.rowIndex;
    else return isThisFormForwarding;
  }

  const value = {
    endForward,
    getForward,
    isForwarding,
    isThisForwarding,
    setForward,
  };

  return (
    <FormForwardContext.Provider value={value}>
      {children}
    </FormForwardContext.Provider>
  );
}

export { FormGroupForwardProvider, useFormForwardContext };
