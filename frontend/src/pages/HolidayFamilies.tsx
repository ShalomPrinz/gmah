import { useState } from "react";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import { BottomMenu, SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import {
  familyIdProp,
  type Family,
  holidayFamiliesTableHeaders,
} from "../modules";
import { File, useFamiliesSearch, useFamilySelection } from "../hooks";

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

  const {
    isFamilySelected,
    selected,
    setSelected,
    setNoSelectedFamily,
    selectedFamilyName,
  } = useFamilySelection();

  return (
    <>
      <main className="container text-center mx-auto">
        <Row>
          <h1 className="mt-5 mb-4">חיפוש משפחות לחגים</h1>
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
            columns={holidayFamiliesTableHeaders}
            data={families}
            dataIdProp={familyIdProp}
            headerHighlight={getSearchByHeader(searchBy)}
            LastColumn={MenuOpenWrapper(setSelected)}
          />
        </Row>
      </main>
      <BottomMenu
        isOpen={isFamilySelected}
        onMenuClose={setNoSelectedFamily}
        title={selectedFamilyName}
      >
        <EditFamily family={selected!} />
      </BottomMenu>
    </>
  );
}

function MenuOpenWrapper(open: (family: Family) => void) {
  return ({ item }: { item: any }) => (
    <button
      className="fs-5 p-2 rounded bg-default border border-none border-0"
      onClick={() => open(item as Family)}
      type="button"
    >
      <span className="ps-2">אפשרויות</span>
      <IconComponent flipHorizontal icon="options" />
    </button>
  );
}

function EditFamily({ family }: { family: Family }) {
  return (
    <Link
      className="bottom-menu-item link-decoration rounded fs-3 p-3"
      to={`edit/${family[familyIdProp]}`}
      state={{ family }}
    >
      <span className="ps-2">עריכה</span>
      <IconComponent icon="editFamily" />
    </Link>
  );
}

export default HolidayFamilies;
