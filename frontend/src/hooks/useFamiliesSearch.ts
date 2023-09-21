import { useEffect, useState } from "react";

import type { Family } from "../modules";
import {
  searchFamilies,
  searchFamiliesHistory,
  searchHolidayFamilies,
} from "../services";
import { useReloadKey } from "./useReloadKey";

enum File {
  FAMILIES,
  FAMILIES_HISTORY,
  HOLIDAY_FAMILIES,
}

function getSearchFunc(file: File) {
  switch (file) {
    case File.FAMILIES:
      return searchFamilies;
    case File.FAMILIES_HISTORY:
      return searchFamiliesHistory;
    case File.HOLIDAY_FAMILIES:
      return searchHolidayFamilies;
    default:
      return searchFamilies;
  }
}

function useFamiliesSearch(
  query: string,
  searchBy: string,
  file: File = File.FAMILIES
) {
  const [families, setFamilies] = useState<Family[]>([]);
  const { reloadKey, updateKey } = useReloadKey();

  const searchFunc = getSearchFunc(file);

  useEffect(() => {
    searchFunc(query, searchBy)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query, searchBy, reloadKey]);

  return { families, reloadFamilies: updateKey };
}

export { File, useFamiliesSearch };
