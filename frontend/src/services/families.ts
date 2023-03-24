import { get, post } from "./http";

async function getFamiliesCount() {
  return get("familiesCount");
}

async function searchFamilies(query: string, by: string) {
  return get("families", { params: { query, by } });
}

async function addFamily(family: any) {
  return post("families", family);
}

export { addFamily, getFamiliesCount, searchFamilies };
