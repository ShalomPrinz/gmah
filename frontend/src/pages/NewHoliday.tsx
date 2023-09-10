import { useRef } from "react";
import { toast } from "react-toastify";

import IconComponent from "../components/Icon";
import { startNewHoliday } from "../services";

function NewHoliday() {
  const titleRef = useRef<HTMLInputElement>(null);

  function generateHoliday() {
    const title = titleRef.current?.value;
    if (typeof title === "undefined") {
      toast.warn("לא ניתן לפתוח חג חדש ללא שם החג", {
        toastId: "holidayNameMissingError",
      });
      return;
    }

    startNewHoliday(title)
      .then(() => toast.success(`יצרת חג חדש בשם ${title} בהצלחה`))
      .catch(() => toast.error("קרתה שגיאה בלתי צפויה"));
  }

  return (
    <main className="text-center">
      <h1 className="my-5">פתיחת חג חדש</h1>
      <h2>
        <label className="ps-4">כותרת:</label>
        <input
          className="fs-3 mb-4 p-2 rounded form-text-input"
          placeholder="הכנס שם חג..."
          ref={titleRef}
          type="text"
        />
      </h2>
      <button
        className="fs-3 bg-default rounded my-3 p-4 button-hover"
        onClick={generateHoliday}
        type="button"
      >
        <span className="ps-3">פתיחת חג</span>
        <IconComponent icon="createPdf" />
      </button>
    </main>
  );
}

export default NewHoliday;
