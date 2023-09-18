import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { ColumnList, Table } from "../components";
import IconComponent from "../components/Icon";
import { useReportContext } from "../contexts";
import { useReloadKey } from "../hooks";
import {
  activateReport,
  getManagers,
  updateDriverPrintStatus,
  updateManagerPrintStatus,
} from "../services";
import type { Driver, Report, Manager } from "../types";
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

const reportColumns = [
  {
    id: 0,
    label: "שם דוח",
    path: "name",
  },
];

const printIgnore = "ignore";
const printDisignore = "";

const managersIgnoreSetting = "אחראי נהגים";
const driversIgnoreSetting = "נהגים";
const activeReportSetting = "דוח קבלה פעיל";
const printSettings = [
  managersIgnoreSetting,
  driversIgnoreSetting,
  activeReportSetting,
];

function PrintSettings() {
  const [selectedSetting, setSelectedSetting] = useState(printSettings[0]);
  const { managers, managersChanged } = useManagers();

  function getSettingComponent() {
    switch (selectedSetting) {
      case managersIgnoreSetting:
        return (
          <ManagersIgnore
            managers={managers}
            managersChanged={managersChanged}
          />
        );
      case driversIgnoreSetting:
        return (
          <DriversIgnore
            managers={managers}
            managersChanged={managersChanged}
          />
        );
      case activeReportSetting:
        return <ActiveReport />;
      default:
        throw Error("Wrong month settings selection");
    }
  }

  return (
    <>
      <h1 className="text-center my-5">הגדרות לדוח קבלה חודשי</h1>
      <main className="mx-5">
        <Row>
          <Col sm="3">
            <h3 className="text-center mb-4">הגדרות</h3>
            <ColumnList
              list={printSettings}
              onItemSelect={(item) => setSelectedSetting(item)}
            />
          </Col>
          {getSettingComponent()}
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

function ActiveReport() {
  const { reports, reportsUpdated } = useReportContext();

  if (reports.length === 0) {
    return <Col className="fs-3 m-5">אין דוחות קבלה במערכת</Col>;
  }

  const activeReport = reports.find(({ active }) => active);
  const hasActiveReport = typeof activeReport !== "undefined";

  function SetActiveReport({ item }: any) {
    const report = item as Report;
    if (report.active) {
      return (
        <button
          className="bg-white text-secondary rounded border border-3 border-secondary button-hover"
          disabled
          onClick={() => {}}
          type="button"
        >
          <span className="px-1">פעיל</span>
        </button>
      );
    }

    return (
      <button
        className="bg-white text-success rounded border border-3 border-success button-hover"
        onClick={() => activateReport(report.name).then(reportsUpdated)}
        type="button"
      >
        <span className="ps-2">בחר</span>
        <IconComponent color="green" icon="selectReport" />
      </button>
    );
  }

  return (
    <>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4>דוחות קבלה</h4>
          <Table
            columns={reportColumns}
            data={reports as []}
            dataIdProp="name"
            LastColumn={SetActiveReport}
          />
        </div>
      </Col>
      <Col>
        <div className="w-75 mx-auto text-center">
          <h4 className="mb-4">דוח קבלה פעיל</h4>
          {hasActiveReport ? (
            <h3 className="fw-bold">{activeReport.name}</h3>
          ) : (
            <h5>- אין דוח קבלה פעיל -</h5>
          )}
        </div>
      </Col>
    </>
  );
}

function useManagers() {
  const { reloadKey, updateKey } = useReloadKey();

  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    getManagers()
      .then((res) => setManagers(res.data.managers))
      .catch((error) =>
        console.error("Error occurred while trying to load managers", error)
      );
  }, [reloadKey]);

  return { managers, managersChanged: updateKey };
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
