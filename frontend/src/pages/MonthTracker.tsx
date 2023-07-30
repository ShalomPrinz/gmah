import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import { NoMonthReports, SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import {
  familyIdProp,
  reportDateProp,
  reportReceiveProp,
  reportTableHeaders,
} from "../modules";
import { getReport } from "../services";
import { formatDate } from "../util";
import { useReportContext } from "../contexts";

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

const defaultQuery = "";
const defaultSearchBy = "name";

const pageTitle = "מעקב חלוקה";
function MonthTracker() {
  const [query, setQuery] = useState(defaultQuery);
  const [searchBy, setSearchBy] = useState(defaultSearchBy);

  const { reportsAvailable, selectedReport } = useReportContext();
  const report = useReportSearch(selectedReport, query, searchBy);

  if (!reportsAvailable) return <NoMonthReports pageTitle={pageTitle} />;

  const isDefaultSearch =
    query === defaultQuery && searchBy === defaultSearchBy;

  const ResultDisplay = isDefaultSearch ? (
    <ReportStats report={report as []} />
  ) : undefined;

  return (
    <>
      <h1 className="text-center mt-5">{pageTitle}</h1>
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

function useReportSearch(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [report, setReport] = useState([]);

  useEffect(() => {
    if (!reportName) return;

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
