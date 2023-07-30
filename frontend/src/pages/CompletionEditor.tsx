import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { Dropdown, getSearchBy, Option, SearchRow, Table } from "../components";
import { NoMonthReports, useMonthReports } from "../hooks";
import {
  familyIdProp,
  reportCompletionHeaders,
  reportCompletionBuilder,
} from "../modules";
import type { CompletionFamily } from "../modules";
import { getReportCompletions } from "../services";
import IconComponent from "../components/Icon";

const buttons = [
  {
    id: "search-by-name",
    header: "שם מלא",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-driver",
    text: "נהג",
    value: "driver",
  },
  {
    id: "search-by-street",
    text: "רחוב",
    value: "street",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

function CompletionEditor() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const reports = useMonthReports();
  const options = reports.map((report, index) => ({
    eventKey: index.toString(),
    value: report,
  }));
  const hasOptions = options.length > 0;

  const { onSelect, selectedReport } = useReportSelection(options);
  const report = useReportCompletions(selectedReport, query, searchBy);

  const { addToCompletion, completionList, removeFromCompletion } =
    useCompletionBuilder();
  const hasCompletionFamilies = completionList.length > 0;

  if (!hasOptions)
    return (
      <>
        <div className="d-flex align-items-center justify-content-center mt-5">
          <h1 className="mx-5">הכנת דף השלמות</h1>
        </div>
        <NoMonthReports />
      </>
    );

  return (
    <>
      <main className="mt-5 text-center">
        <div className="d-flex align-items-center justify-content-center my-4">
          <h1 className="mx-5">הכנת דף השלמות</h1>
          <Dropdown
            title="בחר דוח קבלה"
            onSelect={onSelect}
            options={options}
          />
        </div>
        <Row className="mx-5">
          <Col className="text-center ps-5" sm="8">
            <SearchRow
              onQueryChange={(q: string) => setQuery(q)}
              onSearchByChange={(value: string) => setSearchBy(value)}
              queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
              searchBy={buttons}
            />
            <Row className="mx-5">
              <Table
                columns={reportCompletionHeaders}
                data={report}
                dataIdProp={familyIdProp}
                headerHighlight={getSearchByHeader(searchBy)}
                LastColumn={CompletionAddButton(addToCompletion)}
              />
            </Row>
          </Col>
          <Col sm="4" style={{ marginBottom: "150px" }}>
            {hasCompletionFamilies ? (
              <Table
                columns={reportCompletionBuilder}
                data={completionList}
                dataIdProp={familyIdProp}
                LastColumn={CompletionRemoveButton(removeFromCompletion)}
                numberedTable
              />
            ) : (
              <h5 className="fw-light my-5">- אין משפחות בדף ההשלמה -</h5>
            )}
          </Col>
        </Row>
      </main>
      <button
        className="fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={() => console.log("created", completionList)}
        type="button"
      >
        <span className="ps-3">יצירת הדף</span>
        <IconComponent icon="createPdf" />
      </button>
    </>
  );
}

function CompletionAddButton(add: (item: any) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="fs-5 p-2 rounded bg-default border border-none border-0"
      onClick={() => add(item)}
      type="button"
    >
      <span className="ps-2">הוסף</span>
      <IconComponent icon="addFamily" />
    </button>
  );
}

function CompletionRemoveButton(remove: (item: any) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="bg-white text-danger rounded border border-3 border-danger button-hover"
      onClick={() => remove(item)}
      type="button"
    >
      <span className="ps-2">הסר</span>
      <IconComponent color="red" icon="removeItem" />
    </button>
  );
}

function useReportSelection(options: Option[]) {
  const [selected, setSelected] = useState("0");
  const selectedReport = options.find(
    ({ eventKey }) => selected === eventKey
  )?.value;

  const onSelect = (eventKey: string | null) =>
    eventKey && setSelected(eventKey);

  return { onSelect, selectedReport };
}

function useReportCompletions(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [families, setFamilies] = useState([]);
  const filtered = families.filter((family) => {
    const key = getSearchByHeader(searchBy);
    const familyKey = String(family[key] ?? "");
    return familyKey.includes(query);
  });

  useEffect(() => {
    if (typeof reportName === "undefined") return;

    getReportCompletions(reportName)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get report completions",
          error
        )
      );
  }, [reportName]);

  return filtered;
}

function useCompletionBuilder() {
  const [completionList, setCompletionList] = useState<CompletionFamily[]>([]);

  const isSameFamily = (first: CompletionFamily, second: CompletionFamily) =>
    first[familyIdProp] === second[familyIdProp];

  function addToCompletion(item: CompletionFamily) {
    if (completionList.findIndex((f) => isSameFamily(f, item)) !== -1) {
      toast.warn(`המשפחה ${item[familyIdProp]} כבר נמצאת ברשימת ההשלמות`, {
        toastId: item[familyIdProp],
      });
      return;
    }

    setCompletionList((prev) => [...prev, item]);
  }

  function removeFromCompletion(item: CompletionFamily) {
    setCompletionList((prev) => prev.filter((f) => !isSameFamily(f, item)));
  }

  return { addToCompletion, completionList, removeFromCompletion };
}

export default CompletionEditor;
