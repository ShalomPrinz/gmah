import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ReceiptStatusTable } from "../components";
import { getDriverReceiptStatus, updateDriverStatus } from "../services";
import type { DriverReceipt } from "../types";

interface MonthDriverMarkProps {
  driverName: string;
  reportName: string;
}

function MonthDriverMark({ driverName, reportName }: MonthDriverMarkProps) {
  const { isLoading, driverStatus } = useDriverStatus(reportName, driverName);
  const hasFamilies = driverStatus.length > 0;

  function onSubmit(values: DriverReceipt[]) {
    if (toastErrors(values)) return;

    updateDriverStatus(reportName, values)
      .then(() =>
        toast.success(
          `שינית את סטטוס הקבלה עבור המשפחות של הנהג ${driverName} בהצלחה`
        )
      )
      .catch((err) => {
        const message = err?.response?.data?.description || "שגיאה לא צפויה";
        toast.error(
          `קרתה שגיאה בניסיון לשנות את סטטוס הקבלה עבור המשפחות של הנהג ${driverName}: ${message}`,
          {
            toastId: `${driverName}:${message}`,
          }
        );
      });
  }

  return (
    <>
      {hasFamilies ? (
        <ReceiptStatusTable
          formName={driverName}
          initialValues={driverStatus}
          onSubmit={onSubmit}
        />
      ) : isLoading ? (
        <></>
      ) : (
        <h3>לנהג אין משפחות בחלוקה זו</h3>
      )}
    </>
  );
}

function useDriverStatus(reportName: string, driverName: string) {
  const [driverStatus, setDriverStatus] = useState<DriverReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getDriverReceiptStatus(reportName, driverName)
      .then((res) => setDriverStatus(res.data.status))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get driver receipt status",
          error
        )
      )
      .finally(() => setTimeout(() => setIsLoading(false), 50));
  }, [reportName, driverName]);

  return { isLoading, driverStatus };
}

/** Returns true if has error */
function toastErrors(values: DriverReceipt[]) {
  for (const receipt of values) {
    if (receipt.date == null || receipt.date === "") {
      toast.error("לא ניתן לשנות את סטטוס הקבלה ללא תאריך", {
        toastId: "dateError",
      });
      return true;
    }
  }
  return false;
}

export default MonthDriverMark;
