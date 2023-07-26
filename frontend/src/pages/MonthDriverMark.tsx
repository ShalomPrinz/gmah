import { useEffect, useState } from "react";

import { ReceiptStatusTable } from "../components";
import { getReceiptStatus } from "../services";
import type { DriverReceipt } from "../types";

interface MonthDriverMarkProps {
  driverName: string;
  reportName: string;
}

function MonthDriverMark({ driverName, reportName }: MonthDriverMarkProps) {
  const { isLoading, driverStatus } = useDriverStatus(reportName, driverName);
  const hasFamilies = driverStatus.length > 0;

  return (
    <>
      {hasFamilies ? (
        <ReceiptStatusTable
          formName={driverName}
          initialValues={driverStatus}
          onSubmit={(values) => console.log("submit", values)}
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
    getReceiptStatus(reportName, driverName, "driver")
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

export default MonthDriverMark;
