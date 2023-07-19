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

export { getManagers, updateManagers, removeManager };
