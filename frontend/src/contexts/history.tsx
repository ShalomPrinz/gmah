import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const routerLocationInitialKey = "default";

type FailureCallback = () => void;

interface HistoryContextValue {
  goBack: (failureCallback: FailureCallback) => void;
}

const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

function useHistoryContext() {
  const history = useContext(HistoryContext);
  if (typeof history === "undefined")
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  return history;
}

interface HistoryProviderProps {
  children: ReactNode;
}

function HistoryProvider({ children }: HistoryProviderProps) {
  const navigate = useNavigate();
  const { key } = useLocation();

  // Dismiss all toasts on a route change
  useEffect(() => toast.dismiss(), [key]);

  function goBack(failureCallback: FailureCallback) {
    if (key === routerLocationInitialKey) {
      failureCallback();
    } else {
      navigate(-1);
    }
  }

  const value = {
    goBack,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export { HistoryProvider, useHistoryContext };
