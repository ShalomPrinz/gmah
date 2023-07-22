import { useEffect, useState } from "react";

import type { Family } from "../modules";
import { searchFamilies, searchFamiliesHistory } from "../services";

function useFamiliesSearch(
  query: string,
  searchBy: string,
  history: boolean = false
) {
  const [families, setFamilies] = useState<Family[]>([]);

  const [searchKey, setSearchKey] = useState(0);
  const reloadFamilies = () => setSearchKey((prev) => prev + 1);

  const searchFunc = history ? searchFamiliesHistory : searchFamilies;

  useEffect(() => {
    searchFunc(query, searchBy)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query, searchBy, searchKey]);

  return { families, reloadFamilies };
}

export { useFamiliesSearch };
