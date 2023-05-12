import { get, post } from "./http";

async function getFamiliesCount() {
  return get("familiesCount");
}

async function searchFamilies(query: string, by: string) {
  return get("families", { params: { query, by } });
}

async function addFamilies(families: any) {
  return post("families", families);
}

export { addFamilies, getFamiliesCount, searchFamilies };
