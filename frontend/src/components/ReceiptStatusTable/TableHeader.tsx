import Form from "react-bootstrap/Form";

export interface TableHeaderProps {
  setAllDates: (date: string) => void;
  setAllStatuses: (status: boolean) => void;
}

function TableHeader({ setAllDates, setAllStatuses }: TableHeaderProps) {
  function onDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    if (newDate != null && typeof newDate === "string") {
      setAllDates(newDate);
    }
  }

  function onStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newStatus = e.target.checked;
    if (newStatus != null) {
      setAllStatuses(newStatus);
    }
  }

  return (
    <thead>
      <tr>
        <th className="fs-5 p-3 col-md-4 align-middle">שם מלא</th>
        <th className="fs-5 p-3 col-md-4">
          <div className="d-flex">
            <span className="my-auto px-2">תאריך</span>
            <input
              className="fs-6 rounded p-1 m-1 text-center"
              onChange={onDateChange}
              title="שינוי תאריך לכולם"
              type="date"
            />
          </div>
        </th>
        <th className="fs-5 p-3 col-md-4">
          <div className="d-flex">
            <span className="my-auto px-2">סטטוס</span>
            <Form.Switch
              className="fs-4"
              onChange={onStatusChange}
              style={{ transform: "scaleX(-1)" }}
              title="שינוי סטטוס לכולם"
            />
          </div>
        </th>
      </tr>
    </thead>
  );
}

export default TableHeader;
