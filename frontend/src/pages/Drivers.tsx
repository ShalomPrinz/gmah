import { useEffect, useState } from "react";

import { ConditionalList, Table } from "../components";
import { getDrivers } from "../services";

type Driver = {
  id: string;
  name: string;
  phone: string;
};

interface Managers {
  [name: string]: Driver[];
}

const driversColumns = [
  { id: 0, label: "שם הנהג", path: "name" },
  { id: 1, label: "מס' פלאפון", path: "phone" },
];

function Drivers() {
  const managers = useManagers();

  const managerCallback = (managerName: string) => {
    return (
      <div className="my-4" style={{ width: "35%" }}>
        <h2>{managerName}</h2>
        <Table
          columns={driversColumns}
          data={managers[managerName]}
          dataIdProp="id"
        />
      </div>
    );
  };

  return (
    <>
      <h1 className="my-5 text-center">אחראי נהגים</h1>
      <main className="container text-center d-flex flex-wrap justify-content-evenly">
        <ConditionalList
          list={Object.keys(managers)}
          itemCallback={managerCallback}
        />
      </main>
    </>
  );
}

function useManagers() {
  const [drivers, setDrivers] = useState<Managers>({});

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
