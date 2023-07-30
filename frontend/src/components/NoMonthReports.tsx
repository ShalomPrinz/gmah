import { Link } from "react-router-dom";

interface NoMonthReportsProps {
  pageTitle: string;
}

function NoMonthReports({ pageTitle }: NoMonthReportsProps) {
  return (
    <div className="text-center">
      <h1 className="my-5">{pageTitle}</h1>
      <h3>
        אין דוחות קבלה. באפשרותך
        <Link
          className="link-decoration rounded fs-5 p-3 me-2 fs-3"
          to="/reports"
        >
          לייצר דוח קבלה חדש
        </Link>
      </h3>
    </div>
  );
}

export default NoMonthReports;
