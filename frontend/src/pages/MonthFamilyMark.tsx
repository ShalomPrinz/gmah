import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import IconComponent from "../components/Icon";
import {
  getFamilyReceiptStatus,
  removeFamilyFromReport,
  updateFamilyReceipt,
} from "../services";
import type { Receipt } from "../types";
import { concatArray, getTodayDate } from "../util";

interface MonthFamilyMarkProps {
  familyName: string;
  familyRemovedCallback: () => void;
  reportName: string;
}

function MonthFamilyMark({
  familyName,
  familyRemovedCallback,
  reportName,
}: MonthFamilyMarkProps) {
  const receiptStatus = useReceiptStatus(reportName, familyName);

  const receiptFormKey = concatArray(
    familyName,
    receiptStatus.date,
    receiptStatus.status
  );

  function onSubmit(receipt: Receipt) {
    updateFamilyReceipt(reportName, familyName, receipt)
      .then(() =>
        toast.success(`שינית את סטטוס הקבלה עבור משפחת ${familyName} בהצלחה`)
      )
      .catch((err) => {
        const message = err?.response?.data?.description || "שגיאה לא צפויה";
        toast.error(
          `קרתה שגיאה בניסיון לשנות את סטטוס הקבלה עבור משפחת ${familyName}: ${message}`,
          {
            toastId: `${familyName}:${message}`,
          }
        );
      });
  }

  function removeFamily() {
    removeFamilyFromReport(reportName, familyName)
      .then(() => {
        toast.success(
          `המשפחה ${familyName} הוסרה בהצלחה מדוח הקבלה ${reportName}`
        );
        familyRemovedCallback();
      })
      .catch(() =>
        toast.error(
          `קרתה שגיאה בניסיון להסיר את המשפחה ${familyName} מדוח הקבלה ${reportName}`
        )
      );
  }

  return (
    <>
      <h2>
        {familyName}
        <button
          className="fs-5 p-2 bg-white text-danger rounded border border-3 border-danger button-hover me-5"
          onClick={removeFamily}
          type="button"
        >
          <span className="ps-2">הסר מדוח הקבלה</span>
          <IconComponent color="red" icon="removeItem" />
        </button>
      </h2>
      <ReceiptForm
        initialReceipt={receiptStatus}
        key={receiptFormKey}
        onSubmit={onSubmit}
      />
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

function useReceiptStatus(reportName: string, familyName: string) {
  const [receiptStatus, setReceiptStatus] = useState<Receipt>({
    date: "",
    status: false,
  });

  useEffect(() => {
    getFamilyReceiptStatus(reportName, familyName)
      .then((res) => setReceiptStatus(res.data.status))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get family receipt status",
          error
        )
      );
  }, [reportName, familyName]);

  return receiptStatus;
}

export default MonthFamilyMark;
