import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { getManagers, updateManagerPrintStatus } from "../services";
import { Table } from "../components";
import IconComponent from "../components/Icon";
import type { Manager } from "../types";
import { partition } from "../util";

const columns = [
  {
    id: 0,
    label: "שם אחראי",
    path: "name",
  },
];

function PrintSettings() {
  const { ignoredManagers, managersChanged, printedManagers } = useManagers();

  function IgnoreManagerPrint({ item }: any) {
    return (
      <button
        className="bg-white text-primary rounded border border-3 border-primary button-hover"
        onClick={() =>
          updateManagerPrintStatus(item.name, "ignore").then(managersChanged)
        }
        type="button"
      >
        <span className="ps-2">הוסף</span>
        <IconComponent color="blue" icon="addFamily" />
      </button>
    );
  }

  function DisignoreManagerPrint({ item }: any) {
    return (
      <button
        className="bg-white text-danger rounded border border-3 border-danger button-hover"
        onClick={() =>
          updateManagerPrintStatus(item.name, "").then(managersChanged)
        }
        type="button"
      >
        <span className="ps-2">הסר</span>
        <IconComponent color="red" icon="removeItem" />
      </button>
    );
  }

  return (
    <>
      <h1 className="text-center my-5">הדפסה חודשית לאחראים ונהגים</h1>
      <main className="mx-5">
        <Row>
          <Col>
            <div
              className="mx-auto text-center transform-bigger mt-4"
              style={{ width: "60%" }}
            >
              <h4>אחראי נהגים</h4>
              <Table
                columns={columns}
                data={printedManagers as []}
                dataIdProp="id"
                LastColumn={IgnoreManagerPrint}
              />
            </div>
          </Col>
          <Col>
            <div
              className="mx-auto text-center transform-bigger mt-4"
              style={{ width: "60%" }}
            >
              <h4>אחראי נהגים שלא יודפסו</h4>
              <Table
                columns={columns}
                data={ignoredManagers as []}
                dataIdProp="id"
                LastColumn={DisignoreManagerPrint}
              />
            </div>
          </Col>
        </Row>
      </main>
    </>
  );
}

function useManagers() {
  const [reloadKey, setReloadKey] = useState(0);
  const managersChanged = () => setReloadKey((prev) => prev + 1);

  const [managers, setManagers] = useState<Manager[]>([]);
  const [ignoredManagers, printedManagers] = partition(
    managers,
    (m) => m.print === "ignore"
  );

  useEffect(() => {
    getManagers()
      .then((res) => setManagers(res.data.managers))
      .catch((error) =>
        console.error("Error occurred while trying to load managers", error)
      );
  }, [reloadKey]);

  return { ignoredManagers, managersChanged, printedManagers };
}

export default PrintSettings;
