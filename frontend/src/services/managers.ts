import { get, post, remove } from "./http";

async function getManagers() {
  return get("managers");
}

async function updateManagers(managers: Array<any>) {
  return post("managers", { managers });
}

async function removeManager(managerId: string) {
  return remove("managers/remove", { params: { manager_id: managerId } });
}

async function addManager(managerName: string) {
  return post("managers/add", { manager_name: managerName });
}

export { addManager, getManagers, updateManagers, removeManager };
