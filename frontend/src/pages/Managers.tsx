import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { ConditionalList, Table } from "../components";
import IconComponent from "../components/Icon";
import {
  addManager,
  getManagers,
  removeManager,
  updateManagers,
} from "../services";
import type { Manager } from "../types";

const driversColumns = [
  { id: 0, label: "שם הנהג", path: "name" },
  { id: 1, label: "מס' פלאפון", path: "phone" },
];

function Managers() {
  const [isAddingManager, setIsAddingManager] = useState(false);
  const switchIsAddingManager = () => setIsAddingManager((adding) => !adding);
  const newManagerRef = useRef<HTMLInputElement>(null);

  const { managers, deleteManager, newManager, restoreInitialManagers } =
    useManagers();

  const managerCallback = ({ id, name, drivers }: Manager) => (
    <div className="my-3" style={{ width: "35%" }}>
      <h2>
        {name}
        <button
          className="fs-4 mx-4 p-2 rounded fw-bold bg-white text-danger border border-3 border-danger"
          onClick={() => deleteManager(id)}
          type="button"
        >
          הסר
        </button>
      </h2>
      <Table columns={driversColumns} data={drivers} dataIdProp="name" />
    </div>
  );

  return (
    <>
      <h1 className="mt-5 text-center">
        אחראי נהגים
        <button
          className="me-5 p-3 fs-3 bg-warning border border-dark border-4 rounded"
          onClick={() => {
            restoreInitialManagers();
            setIsAddingManager(false);
          }}
          type="button"
        >
          נקה שינויים
        </button>
        <button
          className="me-5 p-3 fs-3 bg-white text-primary border border-primary border-4 rounded"
          onClick={switchIsAddingManager}
          type="button"
        >
          {isAddingManager ? "בטל הוספה" : "הוסף אחראי"}
        </button>
      </h1>
      <main
        className="container text-center d-flex flex-wrap justify-content-evenly"
        style={{ marginBottom: "100px" }}
      >
        {isAddingManager && (
          <div className="col-12 my-5 fs-5">
            <h2 className="mb-3">שם האחראי החדש:</h2>
            <input
              className="ms-3 p-2 rounded"
              placeholder="לדוגמא: שלום"
              ref={newManagerRef}
              type="text"
            />
            <button
              className="p-2 rounded fw-bold bg-white text-success border border-3 border-success"
              onClick={() => {
                if (newManager(newManagerRef.current?.value))
                  switchIsAddingManager();
              }}
            >
              הוסף אחראי
            </button>
          </div>
        )}
        <ConditionalList list={managers} itemCallback={managerCallback} />
      </main>
      <Link
        className="link-decoration fs-3 bg-default rounded p-4 mt-5 ms-5 mb-5 position-fixed bottom-0 start-0 button-hover"
        to="edit"
        state={{ managers }}
      >
        <span className="ps-3">עריכה</span>
        <IconComponent icon="updateManagers" />
      </Link>
    </>
  );
}

function useManagersVersion() {
  const initialManagersVersion = 0;
  const [managersVersion, setManagersVersion] = useState(
    initialManagersVersion
  );

  const isInitialVersion = initialManagersVersion === managersVersion;
  const advanceManagersVersion = () => setManagersVersion((prev) => prev + 1);
  const restoreManagersVersion = () =>
    setManagersVersion(initialManagersVersion);

  return {
    advanceManagersVersion,
    isInitialVersion,
    managersVersion,
    restoreManagersVersion,
  };
}

function useManagers() {
  const {
    advanceManagersVersion,
    isInitialVersion,
    managersVersion,
    restoreManagersVersion,
  } = useManagersVersion();

  const [managers, setManagers] = useState<Manager[]>([]);
  const initialManagers = useRef<Manager[]>([]);

  useEffect(() => {
    getManagers()
      .then((res) => {
        const { managers } = res.data;
        setManagers(managers);
        if (isInitialVersion) {
          initialManagers.current = managers;
        }
      })
      .catch((error) =>
        console.error("Error occurred while trying to load managers", error)
      );
  }, [managersVersion]);

  function newManager(name: string | undefined) {
    if (typeof name === "undefined" || name === "") {
      toast.error("לא ניתן להוסיף אחראי ללא שם");
      return false;
    }

    if (managers.findIndex((manager) => manager.name === name) !== -1) {
      toast.error(
        `יש כבר אחראי בשם ${name}, אי אפשר שיהיו שני אחראים בעלי אותו שם`
      );
      return false;
    }

    let successfulAdd = true;
    addManager(name)
      .then(() => {
        toast.success(`הוספת אחראי חדש בשם ${name} בהצלחה`);
        advanceManagersVersion();
      })
      .catch(() => {
        toast.error(`קרתה שגיאה לא צפויה בניסיון להוסיף אחראי בשם ${name}`);
        successfulAdd = false;
      });

    return successfulAdd;
  }

  function deleteManager(managerId: string) {
    const managerName = managers.find((m) => m.id === managerId)?.name;
    if (typeof managerName === "undefined") {
      toast.error("קרתה שגיאה לא צפויה");
      return;
    }

    removeManager(managerId)
      .then(() => {
        toast.success(`הסרת את האחראי ${managerName} ואת הנהגים שלו בהצלחה`);
        advanceManagersVersion();
      })
      .catch(() =>
        toast.error(
          `קרתה שגיאה לא צפויה בניסיון להסיר את האחראי ${managerName}`
        )
      );
  }

  function restoreInitialManagers() {
    if (isInitialVersion) {
      toast.info("לא בוצעו שינויים שניתן לשחזר");
      return;
    }

    updateManagers(initialManagers.current)
      .then(() => {
        toast.success("שחזרת את האחראים בהצלחה");
        restoreManagersVersion();
      })
      .catch(() => toast.error("קרתה שגיאה בניסיון לשחזר את האחראים שהוסרו"));
  }

  return { managers, deleteManager, newManager, restoreInitialManagers };
}

export default Managers;
