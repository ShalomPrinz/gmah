import { useState } from "react";
import Row from "react-bootstrap/Row";

import { SearchRow, Table, getSearchBy } from "../components";
import { type Family, familyIdProp, familiesTableHeaders } from "../modules";
import { File, useFamiliesSearch } from "../hooks";

const buttons = [
  {
    id: "search-by-name",
    header: "שם מלא",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-street",
    text: "רחוב",
    value: "street",
  },
  {
    id: "search-by-r11r",
    text: "ממליץ",
    value: "r11r",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

function HolidayFamilies() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families } = useFamiliesSearch(
    query,
    searchBy,
    File.HOLIDAY_FAMILIES
  );
  return (
    <main className="container text-center mx-auto">
      <Row>
        <h1 className="mt-5 mb-4">חיפוש משפחות</h1>
      </Row>
      <SearchRow
        onQueryChange={(q: string) => setQuery(q)}
        onSearchByChange={(value: string) => setSearchBy(value)}
        queryPlaceholder={`הכנס ${getSearchByText(searchBy)} של משפחה...`}
        resultCount={families.length}
        searchBy={buttons}
      />
      <Row>
        <Table
          columns={familiesTableHeaders}
          data={families}
          dataIdProp={familyIdProp}
          headerHighlight={getSearchByHeader(searchBy)}
        />
      </Row>
    </main>
  );
}

export default HolidayFamilies;
