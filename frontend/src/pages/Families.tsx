import { useState } from "react";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { BottomMenu, getSearchBy, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import { useFamiliesSearch, useFamilySelection } from "../hooks";
import { familiesTableHeaders, familyIdProp } from "../modules";
import type { Family } from "../modules";
import { moveRegularToHoliday } from "../services";
import { RemoveFamilyData } from "../types";

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
    id: "search-by-phone",
    header: "מס' פלאפון",
    text: "מספר פלאפון",
    value: "phone",
  },
  {
    id: "search-by-driver",
    text: "נהג",
    value: "driver",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

async function holidayMoveFamilyWrapper(
  familyName: string,
  onPermanentAddSuccess: () => void
) {
  return moveRegularToHoliday(familyName)
    .then(() => {
      toast.success(
        `העברת את משפחת ${familyName} מהמשפחות הקבועות למשפחות החגים`,
        {
          toastId: `holidayAddSuccess:${familyName}`,
        }
      );
      onPermanentAddSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו להעביר את המשפחה ${familyName} למשפחות החגים: ${response.data.description}`,
        {
          toastId: `holidayAddFailure:${familyName}`,
        }
      );
    });
}

const marginFromBottomMenuStyle = (familiesLength: number) => {
  let marginBottom = "30px";
  if (familiesLength === 2) marginBottom = "90px";
  if (familiesLength > 2) marginBottom = "150px";

  return {
    marginBottom,
    minHeight: "80vh",
  };
};

function Families() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families, reloadFamilies } = useFamiliesSearch(query, searchBy);

  const {
    isFamilySelected,
    selected,
    setSelected,
    setNoSelectedFamily,
    selectedFamilyName,
  } = useFamilySelection();

  const moveFamilyToHoliday = (familyName: string) => () => {
    holidayMoveFamilyWrapper(familyName, reloadFamilies);
    setNoSelectedFamily();
  };

  return (
    <>
      <main
        className="container text-center mx-auto"
        style={
          isFamilySelected ? marginFromBottomMenuStyle(families.length) : {}
        }
      >
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
        <MoveToHoliday
          toHolidayFamily={moveFamilyToHoliday(selectedFamilyName)}
        />
        <RemoveFamily
          removeFamilyData={{
            familyName: selectedFamilyName,
            from: "regular",
          }}
        />
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

function MoveToHoliday({ toHolidayFamily }: { toHolidayFamily: () => void }) {
  return (
    <button
      className="bottom-menu-item bg-primary text-white rounded border border-none border-0 fs-3 p-3 me-0"
      onClick={toHolidayFamily}
      type="button"
    >
      <span className="ps-2">לחגים</span>
      <IconComponent icon="addFamily" />
    </button>
  );
}

function RemoveFamily({
  removeFamilyData,
}: {
  removeFamilyData: RemoveFamilyData;
}) {
  return (
    <Link
      className="bottom-menu-item link-decoration bg-danger text-white rounded fs-3 p-3 me-0"
      to={`remove/${removeFamilyData.familyName}`}
      state={{ data: removeFamilyData }}
    >
      <span className="ps-2">הסרה</span>
      <IconComponent icon="removeItem" />
    </Link>
  );
}

export default Families;
