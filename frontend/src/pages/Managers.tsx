import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ConditionalList, Table } from "../components";
import IconComponent from "../components/Icon";
import { getManagers } from "../services";
import type { Manager } from "../types";

const driversColumns = [
  { id: 0, label: "שם הנהג", path: "name" },
  { id: 1, label: "מס' פלאפון", path: "phone" },
];

function Managers() {
  const managers = useManagers();

  const managerCallback = ({ name, drivers }: Manager) => (
    <div className="my-3" style={{ width: "35%" }}>
      <h2>{name}</h2>
      <Table columns={driversColumns} data={drivers} dataIdProp="name" />
    </div>
  );

  return (
    <>
      <h1 className="mt-5 text-center">אחראי נהגים</h1>
      <main
        className="container text-center d-flex flex-wrap justify-content-evenly"
        style={{ marginBottom: "100px" }}
      >
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

function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    getManagers()
      .then((res) => setManagers(res.data.managers))
      .catch((error) =>
        console.error("Error occurred while trying to load managers", error)
      );
  }, []);

  return managers;
}

export default Managers;
