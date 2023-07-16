import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import { Dropdown, Option, RadioMenu, Search, Table } from "../components";
import IconComponent from "../components/Icon";
import { familyIdProp, reportTableHeaders } from "../modules";
import { getReport, getReportsList } from "../services";

const NoReportsMessage = () => (
  <h3 className="text-center mt-5">
    אין דוחות קבלה. באפשרותך
    <Link className="link-decoration rounded fs-5 p-3 me-2 fs-3" to="/reports">
      לייצר דוח קבלה חדש
    </Link>
  </h3>
);

const buttons = [
  {
    id: "search-by-name",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-manager",
    text: "אחראי",
    value: "manager",
  },
  {
    id: "search-by-driver",
    text: "נהג",
    value: "driver",
  },
];

const getButtonTextByValue = (value: string) =>
  buttons.find((b) => b.value === value)?.text || buttons[0].text;

const getHeaderByButtonValue = (value: string) =>
  ({
    name: "שם מלא",
    manager: "אחראי",
    driver: "נהג",
  }[value] || "NoSuchSearchOption");

const defaultSelection = "0";
function MonthTracker() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const options = useMonthReports();
  const { onSelect, selectedReport } = useReportSelection(options);
  const report = useReportSearch(selectedReport, query, searchBy);

  const hasOptions = options.length > 0;

  if (!hasOptions)
    return (
      <>
        <div className="d-flex align-items-center justify-content-center mt-5">
          <h1 className="mx-5">מעקב חלוקה חודשי</h1>
        </div>
        <NoReportsMessage />
      </>
    );

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1 className="mx-5">מעקב חלוקה: {selectedReport}</h1>
        <Dropdown title="בחר דוח קבלה" onSelect={onSelect} options={options} />
      </div>
      <main className="mt-5 text-center mx-auto w-75">
        <Row className="mb-3">
          <Col sm="3">
            <h2>חפש באמצעות:</h2>
            <RadioMenu
              buttons={buttons}
              menuId="search-by"
              onSelect={(value: string) => setSearchBy(value)}
            />
          </Col>
          <Col>
            <Search
              onChange={(q: string) => setQuery(q)}
              placeholder={`הכנס ${getButtonTextByValue(searchBy)} של משפחה...`}
            />
          </Col>
          <Col sm="3">
            <h2>מספר תוצאות</h2>
            <p className="text-primary" style={{ fontSize: "50px" }}>
              {report.length}
            </p>
          </Col>
        </Row>
        <Row>
          <Table
            columnBackground={{
              "קיבל/ה": (received) => {
                if (received === true) return "received";
                if (received === false) return "not-received";
              },
            }}
            columns={reportTableHeaders}
            data={report}
            dataIdProp={familyIdProp}
            headerHighlight={getHeaderByButtonValue(searchBy)}
          />
        </Row>
      </main>
      <Link
        className="link-decoration fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        to="mark-receive"
        state={{ report: selectedReport }}
      >
        <span className="ps-3">סימון קבלה</span>
        <IconComponent icon="markReceive" />
      </Link>
    </>
  );
}

function useMonthReports() {
  const [reports, setReports] = useState([]);
  const options = reports.map((report, index) => ({
    eventKey: index.toString(),
    value: report,
  }));

  useEffect(() => {
    getReportsList().then((res) => setReports(res.data.reports));
  }, []);

  return options;
}

function useReportSelection(options: Option[]) {
  const [selected, setSelected] = useState(defaultSelection);
  const selectedReport = options.find(
    ({ eventKey }) => selected === eventKey
  )?.value;

  const onSelect = (eventKey: string | null) =>
    eventKey && setSelected(eventKey);

  return { onSelect, selectedReport };
}

function useReportSearch(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [report, setReport] = useState([]);

  useEffect(() => {
    if (typeof reportName === "undefined") return;

    getReport(reportName, query, searchBy)
      .then((res) => setReport(res.data.report))
      .catch((error) =>
        console.error("Error occurred while trying to search in report", error)
      );
  }, [reportName, query, searchBy]);

  return report;
}

export default MonthTracker;
