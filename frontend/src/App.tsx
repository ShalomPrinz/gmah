import { useEffect, useState } from "react";

import "./App.css";
import Search from "./components/Search";
import { getFamiliesCount, searchFamilies } from "./services";

function App() {
  const { familiesCount, isLoading } = useFamiliesCount();
  const { families, setQuery } = useFamiliesSearch();
  console.log("families search result", families);

  return (
    <>
      <h1>גמח ישיבת קרית שמונה</h1>
      {isLoading && "טוען את מספר הנתמכים"}
      <h3>מספר נתמכים בגמח: {familiesCount}</h3>
      <Search onChange={(q: string) => setQuery(q)} />
    </>
  );
}

function useFamiliesCount() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    getFamiliesCount()
      .then((res) => setCount(res.data.familiesCount))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get families count",
          error
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return { familiesCount: count, isLoading: loading };
}

function useFamiliesSearch() {
  const [query, setQuery] = useState("");
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    searchFamilies(query)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query]);

  return { families, setQuery };
}

export default App;
