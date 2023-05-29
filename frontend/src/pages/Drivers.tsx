import { useEffect, useState } from "react";

import { getDrivers } from "../services";

function Drivers() {
  const drivers = useDrivers();
  return (
    <>
      <h1>אחראי נהגים</h1>
      <pre>{JSON.stringify(drivers)}</pre>
    </>
  );
}

function useDrivers() {
  const [drivers, setDrivers] = useState({});

  useEffect(() => {
    getDrivers()
      .then((res) => setDrivers(res.data.drivers))
      .catch((error) =>
        console.error("Error occurred while trying to load drivers", error)
      );
  });

  return drivers;
}

export default Drivers;
