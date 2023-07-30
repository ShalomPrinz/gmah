import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { HistoryProvider } from "./history";
import { ReportProvider } from "./ReportContext";

interface AppContextsProviderProps {
  children: ReactNode;
}

function AppContextsProvider({ children }: AppContextsProviderProps) {
  dismissToastsOnRouteChange();

  return (
    <HistoryProvider>
      <ReportProvider>{children}</ReportProvider>
    </HistoryProvider>
  );
}

function dismissToastsOnRouteChange() {
  const { key } = useLocation();
  useEffect(() => toast.dismiss(), [key]);
}

export { AppContextsProvider };
