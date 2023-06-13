import { get, post } from "./http";

async function getManagers() {
  return get("managers");
}

async function updateManagers(managers: Array<any>) {
  return post("managers", { managers });
}

export { getManagers, updateManagers };
