import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { ColumnList, Table } from "../components";
import IconComponent from "../components/Icon";
import {
  getManagers,
  updateDriverPrintStatus,
  updateManagerPrintStatus,
} from "../services";
import { Driver, type Manager } from "../types";
import { partition } from "../util";

const managerColumns = [
  {
    id: 0,
    label: "שם אחראי",
    path: "name",
  },
];

const driverColumns = [
  {
    id: 0,
    label: "שם נהג",
    path: "name",
  },
];

const printIgnore = "ignore";
const printDisignore = "";

const managersIgnoreSetting = "אחראי נהגים";
const driversIgnoreSetting = "נהגים";
const printSettings = [managersIgnoreSetting, driversIgnoreSetting];

function PrintSettings() {
  const [selectedSetting, setSelectedSetting] = useState(printSettings[0]);
  const { managers, managersChanged } = useManagers();

  return (
    <>
      <h1 className="text-center my-5">הדפסה חודשית לאחראים ונהגים</h1>
      <main className="mx-5">
        <Row>
          <Col sm="3">
            <h3 className="text-center mb-4">הגדרות הדפסה</h3>
            <ColumnList
              list={printSettings}
              onItemSelect={(item) => setSelectedSetting(item)}
            />
          </Col>
          {selectedSetting === managersIgnoreSetting ? (
            <ManagersIgnore
              managers={managers}
              managersChanged={managersChanged}
            />
          ) : (
            <DriversIgnore
              managers={managers}
              managersChanged={managersChanged}
            />
          )}
        </Row>
      </main>
    </>
  );
}

interface ButtonProps {
  onClick: () => void;
}

function AddButton({ onClick }: ButtonProps) {
  return (
    <button
      className="bg-white text-primary rounded border border-3 border-primary button-hover"
      onClick={onClick}
      type="button"
    >
      <span className="ps-2">הוסף</span>
      <IconComponent color="blue" icon="addFamily" />
    </button>
  );
}

function RemoveButton({ onClick }: ButtonProps) {
  return (
    <button
      className="bg-white text-danger rounded border border-3 border-danger button-hover"
      onClick={onClick}
      type="button"
    >
      <span className="ps-2">הסר</span>
      <IconComponent color="red" icon="removeItem" />
    </button>
  );
}

interface PrintIgnoreProps {
  managers: Manager[];
  managersChanged: () => void;
}

function ManagersIgnore({ managers, managersChanged }: PrintIgnoreProps) {
  const { ignoredManagers, printedManagers } =
    getManagersByIgnoreStatus(managers);

  function IgnoreManagerPrint({ item }: any) {
    return (
      <AddButton
        onClick={() =>
          updateManagerPrintStatus(item.name, printIgnore).then(managersChanged)
        }
      />
    );
  }

  function DisignoreManagerPrint({ item }: any) {
    return (
      <RemoveButton
        onClick={() =>
          updateManagerPrintStatus(item.name, printDisignore).then(
            managersChanged
          )
        }
      />
    );
  }

  return (
    <>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4>אחראי נהגים</h4>
          <Table
            columns={managerColumns}
            data={printedManagers as []}
            dataIdProp="id"
            LastColumn={IgnoreManagerPrint}
          />
        </div>
      </Col>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4>אחראי נהגים שלא יודפסו</h4>
          <Table
            columns={managerColumns}
            data={ignoredManagers as []}
            dataIdProp="id"
            LastColumn={DisignoreManagerPrint}
          />
        </div>
      </Col>
    </>
  );
}

function DriversIgnore({ managers, managersChanged }: PrintIgnoreProps) {
  const { ignoredDrivers, printedDrivers } = getDriversByIgnoreStatus(managers);

  function IgnoreDriverPrint({ item }: any) {
    return (
      <AddButton
        onClick={() =>
          updateDriverPrintStatus(item.name, printIgnore).then(managersChanged)
        }
      />
    );
  }

  function DisignoreDriverPrint({ item }: any) {
    return (
      <RemoveButton
        onClick={() =>
          updateDriverPrintStatus(item.name, printDisignore).then(
            managersChanged
          )
        }
      />
    );
  }

  return (
    <>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4>נהגים</h4>
          <Table
            columns={driverColumns}
            data={printedDrivers as []}
            dataIdProp="id"
            LastColumn={IgnoreDriverPrint}
          />
        </div>
      </Col>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4>נהגים שלא יודפסו</h4>
          <Table
            columns={driverColumns}
            data={ignoredDrivers as []}
            dataIdProp="id"
            LastColumn={DisignoreDriverPrint}
          />
        </div>
      </Col>
    </>
  );
}

function useManagers() {
  const [reloadKey, setReloadKey] = useState(0);
  const managersChanged = () => setReloadKey((prev) => prev + 1);

  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    getManagers()
      .then((res) => setManagers(res.data.managers))
      .catch((error) =>
        console.error("Error occurred while trying to load managers", error)
      );
  }, [reloadKey]);

  return { managers, managersChanged };
}

const isIgnored = (item: any) => item.print === printIgnore;

function getManagersByIgnoreStatus(managers: Manager[]) {
  const [ignoredManagers, printedManagers] = partition(managers, isIgnored);
  return { ignoredManagers, printedManagers };
}

function getDriversByIgnoreStatus(managers: Manager[]) {
  const drivers = managers.reduce((acc, manager) => {
    acc.push(...manager.drivers);
    return acc;
  }, Array<Driver>());
  const [ignoredDrivers, printedDrivers] = partition(drivers, isIgnored);
  return { ignoredDrivers, printedDrivers };
}

export default PrintSettings;
