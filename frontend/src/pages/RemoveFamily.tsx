import { useRef } from "react";
import Col from "react-bootstrap/Col";
import BsForm from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import IconComponent from "../components/Icon";
import { useLocationState } from "../hooks";
import { removeFamily } from "../services";
import { RemoveFamilyData } from "../types";
import { getFormattedToday } from "../util";
import { useHistoryContext } from "../contexts";

function RemoveFamily() {
  const reasonRef = useRef<HTMLInputElement>(null);
  const monthRemoveRef = useRef<HTMLInputElement>(null);
  const { goBack } = useHistoryContext();

  const removeFamilyData = useLocationState<RemoveFamilyData>(
    "RemoveFamily",
    "data"
  );
  if (removeFamilyData === undefined) return <>Error</>;

  const onRemoveClick = () =>
    removeFamilyWrapper(
      removeFamilyData,
      reasonRef?.current?.value ?? "",
      monthRemoveRef.current?.checked ?? false,
      goBack
    );

  const isHolidayFamilyRemove = removeFamilyData.from === "holiday";

  return (
    <main className="container my-4 text-center">
      <Row className="my-5">
        <h1>הסרת המשפחה: {removeFamilyData.familyName}</h1>
      </Row>
      <Row className="py-3 fs-3 align-items-center">
        <Col sm="3" />
        <Col sm="2">
          <span className="mx-0">סיבת ההסרה:</span>
        </Col>
        <Col sm="2">
          <input
            className="bottom-menu-item rounded p-3"
            placeholder="דוגמא: לא עונה לטלפון"
            ref={reasonRef}
            type="text"
          />
        </Col>
      </Row>
      {!isHolidayFamilyRemove && (
        <Row className="py-3 fs-4 align-items-center">
          <Col sm="3" />
          <Col sm="2">
            <span className="mx-0">להסיר מדוח קבלה נוכחי?</span>
          </Col>
          <Col sm="2">
            <BsForm.Switch
              className="fs-1 my-auto me-2"
              title={"hello"}
              ref={monthRemoveRef}
              style={{ transform: "scaleX(-1)" }}
            />
          </Col>
        </Row>
      )}
      <Row
        className={`py-${
          isHolidayFamilyRemove ? "5" : "3"
        } fs-4 align-items-center mx-auto`}
      >
        <Col>
          <button
            className="bg-danger text-white rounded button-hover border border-none border-0 fs-3 p-3 px-5 me-0"
            onClick={onRemoveClick}
            type="button"
          >
            <span className="ps-2">לחץ לאישור הסרה</span>
            <IconComponent icon="removeItem" />
          </button>
        </Col>
      </Row>
    </main>
  );
}

async function removeFamilyWrapper(
  { familyName, from }: RemoveFamilyData,
  reason: string,
  monthRemove: boolean,
  preSuccessRemove: () => void
) {
  return removeFamily(
    familyName,
    from,
    getFormattedToday() ?? "",
    reason,
    monthRemove
  )
    .then(() => {
      preSuccessRemove();
      setTimeout(() => {
        toast.success(`העברת את משפחת ${familyName} להסטוריית הנתמכים`, {
          toastId: `removeSuccess:${familyName}`,
        });
      }, 100);
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
