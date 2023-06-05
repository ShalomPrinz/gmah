import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ConditionalList, MultiInputTable } from "../components";
import { FormSubmitFn } from "../components/Alternative/types";
import IconComponent from "../components/Icon";
import { driversArraySchema } from "../modules";
import { getDrivers, updateDrivers } from "../services";

type Driver = {
  name: string;
  phone: string;
};

interface Manager {
  id: string;
  name: string;
  drivers: Driver[];
}

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

const toFormName = (managerName: string) => `manager:${managerName}`;
const toManagerName = (formName: string) => formName.split(":")[1];
const toHebrew = (driverProperty: string) =>
  driverProperty === "name" ? "שם הנהג" : "מס' פלאפון";

function Drivers() {
  const managers = useManagers();
  const { registerSubmitFunction, submitAll } = useFormsSubmission();

  const handleClick = async () => {
    const submitResult = await submitAll();
    if (!submitResult) return;

    const updated = managers.map((m) => {
      const formName = toFormName(m.name);
      if (Object.hasOwn(submitResult, formName)) {
        return { ...m, drivers: submitResult[formName] };
      } else return m;
    });
    updateDrivers(updated);
  };

  const managerCallback = ({ name, drivers }: Manager) => {
    const tableName = toFormName(name);
    return (
      <div className="my-3" style={{ width: "40%" }}>
        <h2>{name}</h2>
        <MultiInputTable
          columns={driversColumns}
          defaultItem={defaultDriver}
          initialValues={drivers}
          name={tableName}
          registerSubmit={registerSubmitFunction}
          schema={driversArraySchema(tableName)}
        />
      </div>
    );
  };

  return (
    <>
      <h1 className="mt-5 text-center">אחראי נהגים</h1>
      <main
        className="container text-center d-flex flex-wrap justify-content-evenly"
        style={{ marginBottom: "100px" }}
      >
        <ConditionalList list={managers} itemCallback={managerCallback} />
      </main>
      <button
        className="fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        onClick={handleClick}
        type="button"
      >
        <span className="ps-3">סיום העדכון</span>
        <IconComponent icon="updateDrivers" />
      </button>
    </>
  );
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
                  const managerName = toManagerName(formKey);
                  const hebrewKey = toHebrew(errorKey);
                  const driverNumber = index + 1;
                  // @ts-ignore typescript doesn't allow unknown type
                  const message = errorValue?.message || "שגיאה בלתי צפויה";
                  toast.warn(
                    `יש בעיה אצל ${managerName}, ב${hebrewKey} של נהג ${driverNumber}: ${message}`,
                    { toastId: `${managerName}:${driverNumber}:${hebrewKey}` }
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

function useManagers() {
  const [drivers, setDrivers] = useState<Manager[]>([]);

  useEffect(() => {
    getDrivers()
      .then((res) => setDrivers(res.data.drivers))
      .catch((error) =>
        console.error("Error occurred while trying to load drivers", error)
      );
  }, []);

  return drivers;
}

export default Drivers;
