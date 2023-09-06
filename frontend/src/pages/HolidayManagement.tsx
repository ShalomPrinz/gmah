import { useEffect, useState } from "react";
import { Dropdown } from "../components";
import { getHolidaysList } from "../services";
import { Link } from "react-router-dom";

const defaultHoliday = "";
const pageTitle = "ניהול חג";

function HolidayManagement() {
  const { HolidaysDropdown, selectedHoliday } = useHolidays();

  if (selectedHoliday === defaultHoliday) {
    return (
      <div className="text-center">
        <h1 className="my-5">{pageTitle}</h1>
        <h3>
          אין חגים במערכת. באפשרותך
          <Link
            className="link-decoration rounded fs-5 p-3 me-2 fs-3"
            to="/holidays/new"
          >
            לייצר חג חדש
          </Link>
        </h3>
      </div>
    );
  }
  return (
    <>
      <main className="d-flex justify-content-center align-items-center">
        <h1 className="my-5">{pageTitle}</h1>
        <div className="me-4">{HolidaysDropdown}</div>
      </main>
    </>
  );
}

function useHolidays() {
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    getHolidaysList()
      .then((res) => setHolidays(res.data.holidays))
      .catch(() =>
        console.error("Error occurred while trying to get holidays list")
      );
  }, []);

  return useHolidaysDropdown(holidays);
}

function useHolidaysDropdown(holidays: string[]) {
  const [selected, setSelected] = useState("0");
  const onSelect = (eventKey: string | null) => {
    if (eventKey) setSelected(eventKey);
  };

  const options = holidays.map((name, index) => ({
    eventKey: index.toString(),
    value: name,
  }));

  const selectedHoliday =
    options.find(({ eventKey }) => selected === eventKey)?.value ??
    defaultHoliday;

  const HolidaysDropdown = (
    <Dropdown onSelect={onSelect} options={options} title={selectedHoliday} />
  );

  return { HolidaysDropdown, selectedHoliday };
}

export default HolidayManagement;
