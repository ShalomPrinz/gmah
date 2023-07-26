import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import { Dropdown, Option, SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import {
  familyIdProp,
  reportDateProp,
  reportReceiveProp,
  reportTableHeaders,
} from "../modules";
import { getReport, getReportsList } from "../services";
import { formatDate } from "../util";

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
    header: "שם מלא",
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

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

const defaultSelection = "0";

const defaultQuery = "";
const defaultSearchBy = "name";

function MonthTracker() {
  const [query, setQuery] = useState(defaultQuery);
  const [searchBy, setSearchBy] = useState(defaultSearchBy);

  const options = useMonthReports();
  const { onSelect, selectedReport } = useReportSelection(options);

  const report = useReportSearch(selectedReport, query, searchBy);

  const isDefaultSearch =
    query === defaultQuery && searchBy === defaultSearchBy;
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

  const ResultDisplay = isDefaultSearch ? (
    <ReportStats report={report as []} />
  ) : undefined;

  return (
    <>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1 className="mx-5">מעקב חלוקה: {selectedReport}</h1>
        <Dropdown title="בחר דוח קבלה" onSelect={onSelect} options={options} />
      </div>
      <main className="mt-5 text-center mx-auto w-75">
        <SearchRow
          onQueryChange={(q: string) => setQuery(q)}
          onSearchByChange={(value: string) => setSearchBy(value)}
          queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
          resultCount={report.length}
          ResultDisplay={ResultDisplay}
          searchBy={buttons}
        />
        <Row>
          <Table
            columnMapper={{
              [reportReceiveProp]: (received) => {
                let background = undefined;
                if (received === true) {
                  background = "received";
                } else if (received === false) {
                  background = "not-received";
                }
                return { background };
              },
              [reportDateProp]: (date) => {
                return { text: formatDate(date) };
              },
            }}
            columns={reportTableHeaders}
            data={report}
            dataIdProp={familyIdProp}
            headerHighlight={getSearchByHeader(searchBy)}
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

interface ReportStatsProps {
  report: [];
}

function ReportStats({ report }: ReportStatsProps) {
  const reportFamiliesCount = report.length;

  const familiesReceived = report.filter(
    (family) => family[reportReceiveProp] === true
  ).length;
  const familiesNotReceived = report.filter(
    (family) => family[reportReceiveProp] === false
  ).length;
  const familiesNotSent =
    reportFamiliesCount - familiesReceived - familiesNotReceived;

  return (
    <Row>
      <Col>
        <h5>סה"כ משפחות</h5>
        <p className="fs-3 text-primary">{reportFamiliesCount}</p>
        <h5>לא נשלח</h5>
        <p className="fs-3 text-secondary">{familiesNotSent}</p>
      </Col>
      <Col>
        <h5>קיבלו</h5>
        <p className="fs-3 text-success">{familiesReceived}</p>
        <h5>לא קיבלו</h5>
        <p className="fs-3 text-danger">{familiesNotReceived}</p>
      </Col>
    </Row>
  );
}

export default MonthTracker;
