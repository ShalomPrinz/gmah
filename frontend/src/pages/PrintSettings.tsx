import { useEffect, useState } from "react";

import { getManagers } from "../services";
import { Table } from "../components";
import IconComponent from "../components/Icon";
import type { Manager } from "../types";

const columns = [
  {
    id: 0,
    label: "שם אחראי",
    path: "name",
  },
];

function PrintSettings() {
  const managers = useManagers();

  const LastColumn = () => (
    <button
      className="bg-white text-primary rounded border border-3 border-primary button-hover"
      type="button"
    >
      <span className="ps-2">הוסף</span>
      <IconComponent color="blue" icon="addFamily" />
    </button>
  );

  return (
    <>
      <h1 className="text-center my-5">הדפסה חודשית לנהגים</h1>
      <main className="mx-5">
        <div className="w-50 mx-auto text-center transform-bigger">
          <Table
            columns={columns}
            data={managers as []}
            dataIdProp="id"
            LastColumn={LastColumn}
          />
        </div>
      </main>
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

export default PrintSettings;
