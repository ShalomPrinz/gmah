import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ConditionalList,
  FormGroupForwardProvider,
  InputTableGroup,
} from "../components";
import type { FormResetFn, FormSubmitFn } from "../components/InputTableGroup";
import IconComponent from "../components/Icon";
import { driversArraySchema } from "../modules";
import { updateManagers } from "../services";
import type { Driver, Manager } from "../types";

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
  const managers = useLocationState();

  if (typeof managers === "undefined") return <>Error</>;

  const handleUpdateManagers = async () => {
    const submitResult = await submitAll();
    if (!submitResult) return;

    const updated = managers.map((m) => {
      if (Object.hasOwn(submitResult, m.name)) {
        return { ...m, managers: submitResult[m.name] };
      } else return m;
    });

    updateManagers(updated).then(() => navigate("/managers"));
  };

  const managerCallback = ({ name, drivers }: Manager) => (
    <div className="my-3" style={{ width: "45%" }}>
      <h2>{name}</h2>
      <InputTableGroup
        columns={driversColumns}
        defaultItem={defaultDriver}
        initialValues={drivers}
        formName={name}
        registerReset={registerResetFunction}
        registerSubmit={registerSubmitFunction}
        schema={driversArraySchema(name)}
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
        <FormGroupForwardProvider>
          <ConditionalList list={managers} itemCallback={managerCallback} />
        </FormGroupForwardProvider>
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

function useLocationState() {
  const { state } = useLocation();
  if (state && state.managers) {
    return state.managers as Manager[];
  }

  toast.error("יש בעיה בדרך בה הגעת לעמוד הזה. אם הבעיה חוזרת פנה לשלום", {
    toastId: "EditManagersLocationStateHook",
  });
  return undefined;
}

function useFormsSubmission() {
  const [submitFunctions, setSubmitFunctions] = useState<SubmitFunctions>({});
  useEffect(() => () => setSubmitFunctions({}), []);
  const registerSubmitFunction = (formKey: string, submitFn: FormSubmitFn) => {
    setSubmitFunctions((prev) => ({ ...prev, [formKey]: submitFn }));
  };

  const submitAll = async () => {
    let hasError = false;
    let result: { [formName: string]: Driver[] } = {};
    let promises: Promise<void>[] = [];

    Object.values(submitFunctions).forEach((submitFn) =>
      promises.push(
        submitFn(
          (data) => Object.assign(result, data),
          (errors) => {
            hasError = true;
            Object.entries(errors).forEach(([formKey, errorObject]) => {
              // @ts-ignore typescript doesn't allow forEach here
              errorObject?.forEach((error, index) => {
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
  const registerResetFunction = (resetFn: FormResetFn) => {
    setResetFunctions((prev) => [...prev, resetFn]);
  };

  const resetAll = () => resetFunctions.forEach((resetFn) => resetFn());

  return { registerResetFunction, resetAll };
}

export default EditManagers;
