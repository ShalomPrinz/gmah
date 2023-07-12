import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function useLocationState<T>(page: string, stateProp: string) {
  const { state } = useLocation();
  if (state && state[stateProp]) {
    return state[stateProp] as T;
  }

  toast.error("יש בעיה בדרך בה הגעת לעמוד הזה. אם הבעיה חוזרת פנה לשלום", {
    toastId: `${page}:wrongLocationState`,
  });
  return undefined;
}

export { useLocationState };
