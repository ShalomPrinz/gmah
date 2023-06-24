import { generateMonthReport } from "../services";

function Reports() {
  return (
    <h1 className="text-center m-5">
      <button
        className="bg-default rounded p-3"
        onClick={() => generateMonthReport("יולי")}
      >
        צור דוח קבלה חדש
      </button>
    </h1>
  );
}

export default Reports;
