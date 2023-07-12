import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function MonthReceiptMark() {
  const report = useLocationState();
  return (
    <>
      <div className="text-center mt-5">
        <h1 className="mx-5">סימון קבלה - {report}</h1>
      </div>
    </>
  );
}

function useLocationState() {
  const { state } = useLocation();
  if (state && state.report) {
    return state.report as string;
  }

  toast.error("יש בעיה בדרך בה הגעת לעמוד הזה. אם הבעיה חוזרת פנה לשלום", {
    toastId: "MonthReceiptMark:wrongLocationState",
  });
  return undefined;
}

export default MonthReceiptMark;
