import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { Dropdown } from "../components";
import { useMonthReports } from "../hooks";

interface ReportContextValue {
  reportsAvailable: boolean;
  reportsCountChanged: () => void;
  selectedReport: string;
  SelectReportDropdown: () => JSX.Element;
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

function useReportContext() {
  const report = useContext(ReportContext);
  if (typeof report === "undefined")
    throw new Error("useReportContext must be used within a ReportProvider");
  return report;
}

interface ReportProviderProps {
  children: ReactNode;
}

function ReportProvider({ children }: ReportProviderProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const { onSelect, options, selectedReport } = useReportSelection(reloadKey);

  function reportsCountChanged() {
    setReloadKey((key) => key + 1);
  }

  function SelectReportDropdown() {
    return selectedReport ? (
      <Dropdown
        onSelect={onSelect}
        options={options}
        title={`דוח קבלה ${selectedReport}`}
      />
    ) : (
      <></>
    );
  }

  const value = {
    reportsAvailable: options.length > 0,
    reportsCountChanged,
    selectedReport,
    SelectReportDropdown,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}

const defaultReport = "";

function useReportSelection(reloadKey: number) {
  const reports = useMonthReports(reloadKey);
  const options = reports.map(({ name }, index) => ({
    eventKey: index.toString(),
    value: String(name ?? defaultReport),
  }));

  const [selected, setSelected] = useState("0");
  const selectedReport =
    options.find(({ eventKey }) => selected === eventKey)?.value ??
    defaultReport;

  const onSelect = (eventKey: string | null) => {
    if (eventKey) setSelected(eventKey);
  };

  return { onSelect, options, selectedReport };
}

export { ReportProvider, useReportContext };
