import { useRef } from "react";
import { toast } from "react-toastify";

import IconComponent from "./Icon";
import { removeFamily } from "../services";
import { getFormattedToday } from "../util";

type familyType = "regular" | "holiday";

interface RemoveFamilyProps {
  familyName: string;
  from: familyType;
  onRemoveSuccess: () => void;
}

function RemoveFamily({
  familyName,
  from,
  onRemoveSuccess,
}: RemoveFamilyProps) {
  const reasonRef = useRef<HTMLInputElement>(null);

  const onRemoveClick = () =>
    removeFamilyWrapper(
      familyName,
      from,
      reasonRef?.current?.value ?? "",
      onRemoveSuccess
    );

  return (
    <>
      <button
        className="bottom-menu-item bg-danger text-white rounded border border-none border-0 fs-3 p-3 me-0"
        onClick={onRemoveClick}
        type="button"
      >
        <span className="ps-2">הסרה</span>
        <IconComponent icon="removeItem" />
      </button>
      <label className="fs-5 mx-0">סיבת ההסרה:</label>
      <input
        className="bottom-menu-item rounded p-2"
        placeholder="דוגמא: לא עונה לטלפון"
        ref={reasonRef}
        type="text"
      />
    </>
  );
}

async function removeFamilyWrapper(
  familyName: string,
  from: familyType,
  reason: string,
  onRemoveSuccess: () => void
) {
  return removeFamily(familyName, from, getFormattedToday() ?? "", reason)
    .then(() => {
      toast.success(`העברת את משפחת ${familyName} להסטוריית הנתמכים`, {
        toastId: `removeSuccess:${familyName}`,
      });
      onRemoveSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו להעביר את המשפחה ${familyName} להסטוריית הנתמכים: ${response.data.description}`,
        {
          toastId: `removeFailure:${familyName}`,
        }
      );
    });
}

export default RemoveFamily;
