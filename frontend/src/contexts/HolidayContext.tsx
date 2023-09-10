import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Dropdown } from "../components";
import { getHolidaysList } from "../services";

interface HolidayContextValue {
  selectedHoliday: string;
  hasHolidays: boolean;
  holidaysUpdated: () => void;
  SelectHolidayDropdown: () => JSX.Element;
}

const HolidayContext = createContext<HolidayContextValue | undefined>(
  undefined
);

function useHolidayContext() {
  const holiday = useContext(HolidayContext);
  if (typeof holiday === "undefined")
    throw new Error("useHolidayContext must be used within a HolidayProvider");
  return holiday;
}

interface HolidayProviderProps {
  children: ReactNode;
}

function HolidayProvider({ children }: HolidayProviderProps) {
  const [reloadKey, setReloadKey] = useState(0);
  const { onSelect, options, selectedHoliday } = useHolidays(reloadKey);

  function holidaysUpdated() {
    setReloadKey((key) => key + 1);
  }

  function SelectHolidayDropdown() {
    return selectedHoliday ? (
      <Dropdown
        onSelect={onSelect}
        options={options}
        title={`חג ${selectedHoliday}`}
      />
    ) : (
      <></>
    );
  }

  const value = {
    hasHolidays: options.length > 0,
    holidaysUpdated,
    selectedHoliday,
    SelectHolidayDropdown,
  };

  return (
    <HolidayContext.Provider value={value}>{children}</HolidayContext.Provider>
  );
}

const defaultHoliday = "";
const defaultSelected = "0";

function useHolidays(reloadKey: number) {
  const holidays = useHolidaysList(reloadKey);
  const options = holidays.map((holiday, index) => ({
    eventKey: index.toString(),
    value: holiday,
  }));

  const [selected, setSelected] = useState(defaultSelected);
  const onSelect = (eventKey: string | null) => {
    if (eventKey) setSelected(eventKey);
  };

  const selectedHoliday =
    options.find(({ eventKey }) => selected === eventKey)?.value ??
    defaultHoliday;

  return {
    options,
    onSelect,
    selectedHoliday,
  };
}

function useHolidaysList(reloadKey: number) {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    getHolidaysList()
      .then((res) => setHolidays(res.data.holidays))
      .catch(() =>
        console.error("Error occurred while trying to get holidays list")
      );
  }, [reloadKey]);

  return holidays;
}

export { HolidayProvider, useHolidayContext };
