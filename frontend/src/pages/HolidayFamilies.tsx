import { useState } from "react";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { BottomMenu, SearchRow, Table, getSearchBy } from "../components";
import IconComponent from "../components/Icon";
import { File, useFamiliesSearch, useFamilySelection } from "../hooks";
import {
  familyIdProp,
  type Family,
  holidayFamiliesTableHeaders,
} from "../modules";
import { moveHolidayToRegular } from "../services";
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
    id: "search-by-r11r",
    text: "ממליץ",
    value: "r11r",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

async function permanentAddFamilyWrapper(
  familyName: string,
  onPermanentAddSuccess: () => void
) {
  return moveHolidayToRegular(familyName)
    .then(() => {
      toast.success(
        `העברת את משפחת ${familyName} ממשפחות החגים למשפחות הקבועות`,
        {
          toastId: `permanentAddSuccess:${familyName}`,
        }
      );
      onPermanentAddSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו להעביר את המשפחה ${familyName} למשפחות הקבועות: ${response.data.description}`,
        {
          toastId: `permanentAddFailure:${familyName}`,
        }
      );
    });
}

function HolidayFamilies() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families, reloadFamilies } = useFamiliesSearch(
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

  const addFamilyWrapper = (familyName: string) => () => {
    permanentAddFamilyWrapper(familyName, reloadFamilies);
    setNoSelectedFamily();
  };

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
        <PermanentAddFamily
          addFamilyPermanently={addFamilyWrapper(selectedFamilyName)}
        />
        <RemoveFamily
          removeFamilyData={{
            familyName: selectedFamilyName,
            from: "holiday",
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

function PermanentAddFamily({
  addFamilyPermanently,
}: {
  addFamilyPermanently: () => void;
}) {
  return (
    <button
      className="bottom-menu-item bg-primary text-white rounded border border-none border-0 fs-3 p-3 me-0"
      onClick={addFamilyPermanently}
      type="button"
    >
      <span className="ps-2">לקבועים</span>
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
export default HolidayFamilies;
