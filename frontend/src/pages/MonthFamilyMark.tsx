import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { getReceiptStatus, updateFamilyReceipt } from "../services";
import { concatArray, getTodayDate } from "../util";
import type { Receipt } from "../types";

interface MonthFamilyMarkProps {
  familyName: string;
  reportName: string;
}

function MonthFamilyMark({ familyName, reportName }: MonthFamilyMarkProps) {
  const receiptStatus = useReceiptStatus(reportName, familyName);

  const receiptFormKey = concatArray(
    familyName,
    receiptStatus.date,
    receiptStatus.status
  );

  return (
    <>
      <h2>{familyName}</h2>
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
            .catch((err) => {
              const message =
                err?.response?.data?.description || "שגיאה לא צפויה";
              toast.error(
                `קרתה שגיאה בניסיון לשנות את סטטוס הקבלה עבור משפחת ${familyName}: ${message}`,
                {
                  toastId: `${familyName}:${message}`,
                }
              );
            })
        }
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
    getReceiptStatus(reportName, familyName, "family")
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
