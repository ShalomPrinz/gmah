import { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { ConditionalList } from "../components";
import IconComponent from "../components/Icon";
import { useReportContext } from "../contexts";
import { generateMonthReport, getNoManagerDrivers } from "../services";
import type { NoManagerDriver } from "../types";

const defaultReportName = "חדש";

enum ValidationStatus {
  SUCCESS,
  WARNING,
  FAILURE,
}

function getStatusNoDriverFamilies(count: number) {
  if (count === 0) return ValidationStatus.SUCCESS;
  if (count < 6) return ValidationStatus.WARNING;
  return ValidationStatus.FAILURE;
}

function getStatusNoManagerDrivers(count: number) {
  if (count === 0) return ValidationStatus.SUCCESS;
  if (count < 2) return ValidationStatus.WARNING;
  return ValidationStatus.FAILURE;
}

function getStatusNoManagerFamilies(count: number) {
  if (count === 0) return ValidationStatus.SUCCESS;
  if (count < 10) return ValidationStatus.WARNING;
  return ValidationStatus.FAILURE;
}

function getStatusIcon(status: ValidationStatus) {
  switch (status) {
    case ValidationStatus.WARNING:
      return () => <IconComponent icon="validateWarning" color="orange" />;
    case ValidationStatus.FAILURE:
      return () => <IconComponent icon="validateFailure" color="red" />;
    default:
      return () => <IconComponent icon="validateSuccess" color="green" />;
  }
}

interface ValidationRow {
  getStatus: () => ValidationStatus;
  id: number;
  title: string;
  value: JSX.Element;
}

function Reports() {
  const inputRef = useRef<HTMLInputElement>(null);
  const overrideRef = useRef<HTMLInputElement>(null);
  const { noManagerFamilies, noDriverFamilies, noManagerDrivers } =
    useDriversValidation();
  const { hadNameExistsError, generateReport, isGeneratingReport } =
    useGenerateReport();

  const noManagerDriverCallback = (driver: NoManagerDriver) => (
    <h5>
      {driver.name}: {driver.count} משפחות
    </h5>
  );

  const rows: ValidationRow[] = [
    {
      getStatus: () => getStatusNoDriverFamilies(noDriverFamilies),
      id: 0,
      title: "משפחות ללא נהג",
      value: <h5>{noDriverFamilies}</h5>,
    },
    {
      getStatus: () => getStatusNoManagerDrivers(noManagerDrivers.length),
      id: 1,
      title: "נהגים ללא אחראי",
      value: (
        <ConditionalList
          itemCallback={noManagerDriverCallback}
          keyProp="name"
          list={noManagerDrivers}
        />
      ),
    },
    {
      getStatus: () => getStatusNoManagerFamilies(noManagerFamilies),
      id: 2,
      title: "משפחות עם נהג ללא אחראי",
      value: <h5>{noManagerFamilies}</h5>,
    },
  ];

  const rowCallback = ({ getStatus, title, value }: ValidationRow) => {
    const StatusIcon = getStatusIcon(getStatus());

    return (
      <Row className="my-4 text-center">
        <Col md="5">
          <h2>{title}</h2>
        </Col>
        <Col md="4" className="my-auto">
          {value}
        </Col>
        <Col md="2" className="fs-1">
          <StatusIcon />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <h1 className="text-center m-5">דוחות קבלה</h1>
      <main className="container">
        <Row>
          <Col md="8">
            <ConditionalList itemCallback={rowCallback} list={rows} />
          </Col>
          <Col md="4" className="text-center">
            <h4>הכנס כותרת לדוח קבלה</h4>
            <input
              className="w-75 fs-3 p-3 mt-3 mb-4 mx-auto rounded form-control"
              placeholder="לדוגמא: ינואר"
              ref={inputRef}
              style={{ border: "3px solid #a4d2f5" }}
              type="text"
            />
            <button
              className="fs-1 p-4 bg-default rounded button-hover"
              disabled={isGeneratingReport}
              onClick={() =>
                generateReport(
                  inputRef?.current?.value,
                  overrideRef?.current?.checked
                )
              }
            >
              צור דוח קבלה חדש
            </button>
            {hadNameExistsError && (
              <div className="my-4 d-flex justify-content-center">
                <span className="fs-5 my-auto">
                  <b>שים לב! </b>
                  באפשרותך למחוק את הדוח הקודם בשם זה וליצור חדש במקומו.
                </span>
                <Form.Switch
                  className="fs-1"
                  defaultChecked={false}
                  name="overrideReportName"
                  ref={overrideRef}
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
            )}
          </Col>
        </Row>
      </main>
    </>
  );
}

function useDriversValidation() {
  const [noManagerDrivers, setNoManagerDrivers] = useState<NoManagerDriver[]>(
    []
  );
  const noManagerFamilies = noManagerDrivers.reduce((total, { count }) => {
    return total + count;
  }, 0);

  const [noDriverFamilies, setNoDriverFamilies] = useState(0);

  useEffect(() => {
    getNoManagerDrivers()
      .then((res) => {
        setNoManagerDrivers(res.data.no_manager_drivers);
        setNoDriverFamilies(res.data.no_driver_families);
      })
      .catch(() =>
        toast.error("קרתה שגיאה לא צפויה בניסיון לבדוק את הפרטים לדוח קבלה")
      );
  }, []);

  return { noManagerFamilies, noDriverFamilies, noManagerDrivers };
}

function useGenerateReport() {
  const [isGeneratingReport, setIsGenerating] = useState(false);
  const [hadNameExistsError, setHadNameExistsError] = useState(false);
  const { reportsUpdated } = useReportContext();

  function generateReport(
    value: string | undefined,
    overrideName: boolean | undefined
  ) {
    const reportName = value || defaultReportName;
    const override = overrideName || false;

    setIsGenerating(true);
    generateMonthReport(reportName, override)
      .then(() => {
        toast.success(`יצרת דוח קבלה חדש בשם ${reportName} בהצלחה`, {
          toastId: `reportSuccess:${reportName}`,
        });
        setHadNameExistsError(false);
        reportsUpdated();
      })
      .catch((err) => {
        if (err?.response?.data?.error === "File Already Exists") {
          toast.error(err.response.data.description, {
            toastId: `reportExists:${reportName}`,
          });
          setHadNameExistsError(true);
        } else {
          toast.error(
            "קרתה תקלה ביצירת דוח הקבלה, אם התקלה חוזרת אנא פנה לשלום",
            { toastId: `reportFailure:${reportName}` }
          );
        }
      })
      .finally(() => setIsGenerating(false));
  }
  return { hadNameExistsError, generateReport, isGeneratingReport };
}

export default Reports;
