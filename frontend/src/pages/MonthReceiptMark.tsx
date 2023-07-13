import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { ColumnList, ConditionalList, Search } from "../components";
import { useLocationState } from "../hooks";
import { familyIdProp } from "../modules";
import { getReport, updateFamilyReceipt } from "../services";
import type { Receipt } from "../types";
import { toast } from "react-toastify";

interface MarkMode {
  id: string;
  label: string;
  property: string;
  searchBy: string;
}

const driverMarkMode = {
  id: "BY_DRIVER",
  label: "סימון לפי נהג",
  property: "נהג",
  searchBy: "driver",
};

const manualMarkMode = {
  id: "MANUAL",
  label: "סימון ידני",
  property: familyIdProp,
  searchBy: "name",
};

const markModes = [driverMarkMode, manualMarkMode];
const defaultMode = driverMarkMode;

const extractPropertyToList = (list: any[], property: string) =>
  Array.from<string>(
    list.reduce((set, item) => {
      set.add(item[property]);
      return set;
    }, new Set<string>())
  ).map((item: string) => ({
    title: item,
  }));

const getReceiptStatus = (list: any[], itemKey: any) => {
  const item = list.find((item) => itemKey === item?.[familyIdProp]);
  return {
    date: (item?.["תאריך"] ?? "") as string,
    status: (item?.["קיבל/ה"] ?? false) as boolean,
  };
};

function MonthReceiptMark() {
  const reportName =
    useLocationState<string>("MonthReceiptMark", "report") ?? "";

  const [query, setQuery] = useState("");
  const [markMode, setMarkMode] = useState(defaultMode);

  const searchResult = useReportSearch(reportName, query, markMode.searchBy);
  const columnListData = extractPropertyToList(searchResult, markMode.property);

  const [selectedItem, setSelectedItem] = useState("");
  const receiptStatus = getReceiptStatus(searchResult, selectedItem);

  const modeButtonCallback = (mode: MarkMode) => {
    const color =
      markMode.id === mode.id
        ? "bg-primary text-white"
        : "bg-white text-secondary";
    return (
      <button
        className={`m-2 p-3 ${color} rounded fs-4 border border-0`}
        onClick={() => setMarkMode(mode)}
      >
        {mode.label}
      </button>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <h1 className="mx-5 my-auto">סימון קבלה - {reportName}</h1>
        <ConditionalList list={markModes} itemCallback={modeButtonCallback} />
      </div>
      <main className="d-flex">
        <div className="mx-5" style={{ width: "40%" }}>
          <Search
            onChange={(q: string) => setQuery(q)}
            placeholder={`הכנס ${markMode.property} של משפחה...`}
          />
          <ColumnList
            list={columnListData}
            key={`${columnListData.length}${markMode.id}`}
            onItemSelect={setSelectedItem}
          />
        </div>
        <div className="text-center my-3 mx-5" style={{ width: "45%" }}>
          <h2 className="mt-4">{selectedItem}</h2>
          {markMode.id === manualMarkMode.id && (
            <ReceiptForm
              initialReceipt={receiptStatus}
              key={selectedItem}
              onSubmit={(receipt) =>
                updateFamilyReceipt(reportName, selectedItem, receipt)
                  .then(() =>
                    toast.success(
                      `שינית את סטטוס הקבלה עבור משפחת ${selectedItem} בהצלחה`
                    )
                  )
                  .catch(() =>
                    toast.error(
                      `קרתה שגיאה בניסיון לשנות את סטטוס הקבלה עבור משפחת ${selectedItem}`
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

  return (
    <form
      className="my-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          date: dateRef.current?.value ?? "",
          status: statusRef.current?.checked ?? false,
        });
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
          className="w-25 mx-3 fs-3 p-3 rounded bg-default button-hover"
          type="submit"
        >
          שמור שינויים
        </button>
      </Row>
    </form>
  );
}

function useReportSearch(
  reportName: string | undefined,
  query: string,
  searchBy: string
) {
  const [report, setReport] = useState(Array());

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

export default MonthReceiptMark;
