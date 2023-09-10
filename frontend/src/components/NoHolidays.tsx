import { Link } from "react-router-dom";

interface NoHolidaysProps {
  pageTitle: string;
}

function NoHolidays({ pageTitle }: NoHolidaysProps) {
  return (
    <div className="text-center">
      <h1 className="my-5">{pageTitle}</h1>
      <h3>
        אין חגים במערכת. באפשרותך
        <Link
          className="link-decoration rounded fs-5 p-3 me-2 fs-3"
          to="/holidays/new"
        >
          לפתוח חג חדש
        </Link>
      </h3>
    </div>
  );
}

export default NoHolidays;
