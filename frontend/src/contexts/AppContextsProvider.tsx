import type { ReactNode } from "react";
import { toast } from "react-toastify";

import { HistoryProvider } from "./history";
import { ReportProvider } from "./ReportContext";
import { useRouteChange } from "../hooks";

interface AppContextsProviderProps {
  children: ReactNode;
}

function AppContextsProvider({ children }: AppContextsProviderProps) {
  useRouteChange(toast.dismiss);

  return (
    <HistoryProvider>
      <ReportProvider>{children}</ReportProvider>
    </HistoryProvider>
  );
}

export { AppContextsProvider };
