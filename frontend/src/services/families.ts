import { get } from "./http";

async function getFamiliesCount() {
  return get("familiesCount");
}

async function searchFamilies(query: string) {
  return get("families", { params: { query } });
}

export { getFamiliesCount, searchFamilies };
