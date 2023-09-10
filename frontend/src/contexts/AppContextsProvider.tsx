import type { ReactNode } from "react";
import { toast } from "react-toastify";

import { HistoryProvider } from "./history";
import { HolidayProvider } from "./HolidayContext";
import { ReportProvider } from "./ReportContext";
import { useRouteChange } from "../hooks";

interface AppContextsProviderProps {
  children: ReactNode;
}

function AppContextsProvider({ children }: AppContextsProviderProps) {
  useRouteChange(toast.dismiss);

  return (
    <HistoryProvider>
      <HolidayProvider>
        <ReportProvider>{children}</ReportProvider>
      </HolidayProvider>
    </HistoryProvider>
  );
}

export { AppContextsProvider };
