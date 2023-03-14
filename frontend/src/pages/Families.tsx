import { useEffect, useState } from "react";
import { Table } from "../components";

import Search from "../components/Search";
import { searchFamilies } from "../services";

const columns = [
  {
    id: 0,
    label: "שם מלא",
    path: "fullName",
  },
  {
    id: 1,
    label: "רחוב",
    path: "street",
  },
  {
    id: 2,
    label: "בניין",
    path: "house",
  },
  {
    id: 3,
    label: "דירה",
    path: "apartmentNumber",
  },
  {
    id: 4,
    label: "קומה",
    path: "floor",
  },
  {
    id: 5,
    label: "מס' בית",
    path: "homePhone",
  },
  {
    id: 6,
    label: "מס' פלאפון",
    path: "mobilePhone",
  },
  {
    id: 7,
    label: "נהג במקור",
    path: "originalDriver",
  },
  {
    id: 8,
    label: "ממליץ",
    path: "referrer",
  },
  {
    id: 9,
    label: "הערות",
    path: "notes",
  },
];

function Families() {
  const { families, setQuery } = useFamiliesSearch();

  return (
    <main className="text-center w-75 mx-auto">
      <h1 className="my-5">חיפוש משפחות</h1>
      <Search onChange={(q: string) => setQuery(q)} />
      <Table columns={columns} data={families} dataIdProp="fullName" />
    </main>
  );
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

export default Families;
