import { useEffect, useState } from "react";

import { ConditionalList, MultiInputTable } from "../components";
import { driversArraySchema } from "../modules";
import { getDrivers } from "../services";

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

function Drivers() {
  const managers = useManagers();

  const managerCallback = ({ name, drivers }: Manager) => {
    const tableName = `managers:${name}`;
    return (
      <div className="my-3" style={{ width: "40%" }}>
        <h2>{name}</h2>
        <MultiInputTable
          columns={driversColumns}
          defaultItem={defaultDriver}
          initialValues={drivers}
          name={tableName}
          schema={driversArraySchema(tableName)}
        />
      </div>
    );
  };

  return (
    <>
      <h1 className="mt-5 text-center">אחראי נהגים</h1>
      <main className="container text-center d-flex flex-wrap justify-content-evenly">
        <ConditionalList list={managers} itemCallback={managerCallback} />
      </main>
    </>
  );
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
