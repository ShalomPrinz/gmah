import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { InputTableGroup, SingleInputTable } from "../components";
import type {
  FormResetFn,
  FormSubmitFn,
  InputGroupFormValues,
  RegisterReset,
  RegisterSubmit,
} from "../components";
import IconComponent from "../components/Icon";

import { driversArraySchema } from "../modules";
import { updateManagers } from "../services";
import type { Driver, Manager } from "../types";
import { useLocationState } from "../hooks";
import { findDuplicatedProperty, trimObject } from "../util";

const defaultDriver: Driver = {
  name: "",
  phone: "",
};

const driversColumns = [
  { id: 0, label: "שם הנהג", path: "name" },
  { id: 1, label: "מס' פלאפון", path: "phone" },
];

type SubmitFunctions = {
  [formKey: string]: FormSubmitFn;
};

const toHebrew = (driverProperty: string) =>
  driverProperty === "name" ? "שם הנהג" : "מס' פלאפון";

function EditManagers() {
  const navigate = useNavigate();
  const { registerSubmitFunction, submitAll } = useFormsSubmission();
  const { registerResetFunction, resetAll } = useFormsReset();
  const managers = useLocationState<Manager[]>("EditManagers", "managers");

  if (typeof managers === "undefined") return <>Error</>;

  const handleUpdateManagers = async () => {
    const submitResult = await submitAll();
    if (!submitResult) return;

    const duplicated = findDuplicatedProperty(submitResult, "title");
    if (duplicated && typeof duplicated === "string") {
      toast.error(`אי אפשר שיהיו שני אחראי נהגים עם אותו שם: ${duplicated}`);
      return;
    }

    const updated = managers.map((m) => {
      const { title, values } = submitResult[m.name];
      const trimmedValues = values.map((driver) => trimObject(driver));
      return { id: m.id, drivers: trimmedValues, name: title.trim() };
    });

    updateManagers(updated).then(() => navigate("/managers"));
  };

  const managerCallback = ({ name, drivers }: Manager) => (
    <div className="my-3" style={{ width: "45%" }}>
      <SingleInputTable
        columns={driversColumns}
        defaultItem={defaultDriver}
        initialValues={drivers}
        formName={name}
        registerReset={registerResetFunction}
        registerSubmit={registerSubmitFunction}
        schema={driversArraySchema(name)}
        titleDescription="שם אחראי"
      />
    </div>
  );

  return (
    <>
      <h1 className="mt-5 text-center">
        אחראי נהגים
        <button
          className="me-5 p-3 fs-3 bg-warning border border-dark border-4 rounded"
          onClick={resetAll}
        >
          נקה שינויים
        </button>
      </h1>
      <main
        className="container text-center d-flex flex-wrap justify-content-evenly"
        style={{ marginBottom: "100px" }}
      >
        <InputTableGroup tables={managers} tableCallback={managerCallback} />
      </main>
      <button
        className="fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={handleUpdateManagers}
        type="button"
      >
        <span className="ps-3">סיום העדכון</span>
        <IconComponent icon="updateManagers" />
      </button>
    </>
  );
}

function useFormsSubmission() {
  const [submitFunctions, setSubmitFunctions] = useState<SubmitFunctions>({});
  useEffect(() => () => setSubmitFunctions({}), []);
  const registerSubmitFunction: RegisterSubmit = (formKey, submitFn) => {
    setSubmitFunctions((prev) => ({ ...prev, [formKey]: submitFn }));
  };

  const submitAll = async () => {
    let hasError = false;
    let result: InputGroupFormValues = {};
    let promises: Promise<void>[] = [];

    Object.values(submitFunctions).forEach((submitFn) =>
      promises.push(
        submitFn(
          (data) => Object.assign(result, data),
          (errors) => {
            hasError = true;
            Object.entries(errors).forEach(([formKey, errorObject]) => {
              if (errorObject?.title) {
                const message =
                  errorObject.title?.message || "שגיאה בלתי צפויה";
                toast.warn(
                  `יש בעיה אצל ${formKey}, בשם החדש של האחראי: ${message}`,
                  {
                    toastId: `${formKey}:${errorObject.title}`,
                  }
                );
              }
              // @ts-ignore typescript doesn't allow forEach here
              errorObject?.values?.forEach((error, index) => {
                Object.entries(error).forEach(([errorKey, errorValue]) => {
                  const hebrewKey = toHebrew(errorKey);
                  const driverNumber = index + 1;
                  // @ts-ignore typescript doesn't allow unknown type
                  const message = errorValue?.message || "שגיאה בלתי צפויה";
                  toast.warn(
                    `יש בעיה אצל ${formKey}, ב${hebrewKey} של נהג ${driverNumber}: ${message}`,
                    { toastId: `${formKey}:${driverNumber}:${hebrewKey}` }
                  );
                });
              });
            });
          }
        )()
      )
    );

    await Promise.all(promises);
    if (hasError) return false;
    return result;
  };

  return { registerSubmitFunction, submitAll };
}

function useFormsReset() {
  const [resetFunctions, setResetFunctions] = useState<FormResetFn[]>([]);
  useEffect(() => () => setResetFunctions([]), []);
  const registerResetFunction: RegisterReset = (resetFn) => {
    setResetFunctions((prev) => [...prev, resetFn]);
  };

  const resetAll = () => resetFunctions.forEach((resetFn) => resetFn());

  return { registerResetFunction, resetAll };
}

export default EditManagers;
