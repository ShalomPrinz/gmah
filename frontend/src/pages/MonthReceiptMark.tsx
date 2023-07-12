import { useLocationState } from "../hooks";

function MonthReceiptMark() {
  const report = useLocationState<string>("MonthReceiptMark", "report");
  return (
    <>
      <div className="text-center mt-5">
        <h1 className="mx-5">סימון קבלה - {report}</h1>
      </div>
    </>
  );
}

export default MonthReceiptMark;
