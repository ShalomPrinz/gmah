import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Dropdown } from "../components";
import { useMonthReports } from "../hooks";
import type { Report } from "../types";

interface ReportContextValue {
  reports: Report[];
  reportsAvailable: boolean;
  reportsUpdated: () => void;
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
  const { onSelect, options, reports, selectedReport } =
    useReportSelection(reloadKey);

  function reportsUpdated() {
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
    reports,
    reportsAvailable: options.length > 0,
    reportsUpdated,
    selectedReport,
    SelectReportDropdown,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}

const defaultReport = "";
const defaultSelected = "0";

function useReportSelection(reloadKey: number) {
  const { activeReportIndex, reports } = useMonthReports(reloadKey);
  const options = reports.map(({ name }, index) => ({
    eventKey: index.toString(),
    value: String(name ?? defaultReport),
  }));

  const [selected, setSelected] = useState(defaultSelected);
  const selectedReport =
    options.find(({ eventKey }) => selected === eventKey)?.value ??
    defaultReport;

  useEffect(() => {
    const activeReport =
      activeReportIndex >= 0 ? activeReportIndex.toString() : defaultSelected;

    if (selected != activeReport) {
      setSelected(activeReport);
    }
  }, [activeReportIndex]);

  const onSelect = (eventKey: string | null) => {
    if (eventKey) setSelected(eventKey);
  };

  return { onSelect, options, reports, selectedReport };
}

export { ReportProvider, useReportContext };
