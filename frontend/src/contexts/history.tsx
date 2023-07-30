import { createContext, useContext, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const routerLocationInitialKey = "default";

interface HistoryContextValue {
  goBack: () => void;
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

  function goBack() {
    if (key === routerLocationInitialKey) {
      toast.error("הגעת לדף הבית", { toastId: "endOfHistory" });
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
