import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { ColumnList, ListItem, Search } from "../components";
import { useLocationState } from "../hooks";
import { familyIdProp } from "../modules";
import {
  getReceiptStatus,
  getReportColumn,
  updateFamilyReceipt,
} from "../services";
import type { Receipt } from "../types";
import { concatArray, getTodayDate } from "../util";

interface MarkMode {
  id: string;
  label: string;
  property: string;
  searchBy: string;
}

const manualMarkMode: MarkMode = {
  id: "MANUAL",
  label: "סימון ידני",
  property: familyIdProp,
  searchBy: "name",
};

function MonthReceiptMarkWrapper() {
  const reportName =
    useLocationState<string>("MonthReceiptMark", "report") ?? "";

  const reportColumn = useReportColumn(reportName);

  return (
    <MonthReceiptMark
      columnList={reportColumn}
      key={reportColumn.length}
      reportName={reportName}
    />
  );
}

interface MonthReceiptMarkProps {
  columnList: ListItem[];
  reportName: string;
}

function MonthReceiptMark({ columnList, reportName }: MonthReceiptMarkProps) {
  const [query, setQuery] = useState("");
  const searchResult = columnList.filter(({ title }) => title.includes(query));

  const [familyName, setFamilyName] = useState("");
  const familyNotFound = familyName === "";

  const receiptStatus = useReceiptStatus(reportName, familyName);

  const receiptFormKey = concatArray(
    familyName,
    receiptStatus.date,
    receiptStatus.status,
    searchResult.length
  );

  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <h1 className="mx-5 my-auto">סימון קבלה - {reportName}</h1>
      </div>
      <main className="d-flex">
        <div className="mx-5" style={{ width: "40%" }}>
          <Search
            onChange={(q: string) => setQuery(q)}
            placeholder={`הכנס ${manualMarkMode.property} של משפחה...`}
          />
          <ColumnList
            key={searchResult.length}
            list={searchResult}
            onItemSelect={setFamilyName}
          />
        </div>
        <div className="text-center my-3 mx-5" style={{ width: "45%" }}>
          <h2 className="mt-4">{familyName}</h2>
          {familyNotFound ? (
            <h3 className="my-5 fw-light">לא מצאנו משפחה כזו בדוח הקבלה</h3>
          ) : (
            <ReceiptForm
              initialReceipt={receiptStatus}
              key={receiptFormKey}
              onSubmit={(receipt) =>
                updateFamilyReceipt(reportName, familyName, receipt)
                  .then(() =>
                    toast.success(
                      `שינית את סטטוס הקבלה עבור משפחת ${familyName} בהצלחה`
                    )
                  )
                  .catch(() =>
                    toast.error(
                      `קרתה שגיאה בניסיון לשנות את סטטוס הקבלה עבור משפחת ${familyName}`
                    )
                  )
              }
            />
          )}
        </div>
      </main>
    </>
  );
}

interface ReceiptFormProps {
  initialReceipt: Receipt;
  onSubmit: (receipt: Receipt) => void;
}

function ReceiptForm({ initialReceipt, onSubmit }: ReceiptFormProps) {
  const dateRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    onSubmit({
      date: dateRef.current?.value ?? "",
      status: statusRef.current?.checked ?? false,
    });
  };

  const markToday = (status: boolean) => {
    if (!dateRef.current || !statusRef.current) {
      toast.error("קרתה שגיאה לא צפויה");
      return;
    }

    dateRef.current.value = getTodayDate();
    statusRef.current.checked = status;
    submit();
  };

  const markReceivedToday = () => markToday(true);
  const markNotReceivedToday = () => markToday(false);

  return (
    <form
      className="my-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Row>
        <Col>
          <label className="fs-4 my-2 fw-bold" htmlFor="dateInput">
            תאריך
          </label>
          <input
            className="form-control fs-4 p-3 rounded"
            defaultValue={initialReceipt.date}
            name="dateInput"
            ref={dateRef}
            type="date"
          />
        </Col>
        <Col>
          <label className="fs-4 my-2 fw-bold" htmlFor="receiveInput">
            קיבל/ה
          </label>
          <Form.Switch
            className="fs-1"
            defaultChecked={initialReceipt.status}
            name="receiveInput"
            ref={statusRef}
            style={{ transform: "scaleX(-1)" }}
          />
        </Col>
      </Row>
      <Row className="mt-5 d-flex justify-content-center">
        <button
          className="w-25 mx-2 fs-4 p-2 rounded bg-default button-hover"
          type="submit"
        >
          שמור שינויים
        </button>
        <button
          className="w-25 mx-2 fs-4 p-2 rounded bg-default button-hover"
          onClick={markReceivedToday}
          type="button"
        >
          קיבל/ה היום
        </button>
        <button
          className="w-25 mx-2 fs-4 p-2 rounded bg-default button-hover"
          onClick={markNotReceivedToday}
          type="button"
        >
          לא קיבל/ה היום
        </button>
      </Row>
    </form>
  );
}

function useReportColumn(reportName: string) {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getReportColumn(reportName, "", manualMarkMode.searchBy)
      .then((res) => setSearchResult(res.data.report_column))
      .catch((error) =>
        console.error("Error occurred while trying to search in report", error)
      );
  }, [reportName]);

  return searchResult;
}

function useReceiptStatus(reportName: string, familyName: string) {
  const [receiptStatus, setReceiptStatus] = useState<Receipt>({
    date: "",
    status: false,
  });

  useEffect(() => {
    getReceiptStatus(reportName, familyName)
      .then((res) => setReceiptStatus(res.data.receipt_status))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get receipt status",
          error
        )
      );
  }, [reportName, familyName]);

  return receiptStatus;
}

export default MonthReceiptMarkWrapper;
