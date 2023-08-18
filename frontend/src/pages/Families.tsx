import { useRef, useState } from "react";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { BottomMenu, getSearchBy, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import { useFamiliesSearch } from "../hooks";
import { familiesTableHeaders, familyIdProp } from "../modules";
import type { Family } from "../modules";
import { removeFamily } from "../services";
import { getFormattedToday } from "../util";

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

async function removeFamilyWrapper(
  familyName: string,
  reason: string,
  onRemoveSuccess: () => void
) {
  return removeFamily(familyName, getFormattedToday() ?? "", reason)
    .then(() => {
      toast.success(`העברת את משפחת ${familyName} להסטוריית הנתמכים`, {
        toastId: `removeSuccess:${familyName}`,
      });
      onRemoveSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו להעביר את המשפחה ${familyName} להסטוריית הנתמכים: ${response.data.description}`,
        {
          toastId: `removeFailure:${familyName}`,
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

  const onFamilyRemove = (reason: string) =>
    removeFamilyWrapper(selectedFamilyName, reason, () => {
      setNoSelectedFamily();
      reloadFamilies();
    });

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
        <RemoveFamily onRemove={onFamilyRemove} />
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

function RemoveFamily({ onRemove }: { onRemove: (reason: string) => void }) {
  const reasonRef = useRef<HTMLInputElement>(null);

  const onRemoveClick = () => onRemove(reasonRef?.current?.value ?? "");

  return (
    <>
      <button
        className="bottom-menu-item bg-danger text-white rounded border border-none border-0 fs-3 p-3"
        onClick={onRemoveClick}
        type="button"
      >
        <span className="ps-2">הסרה</span>
        <IconComponent icon="removeItem" />
      </button>
      <label className="fs-5 mx-0">סיבת ההסרה:</label>
      <input
        className="bottom-menu-item rounded p-2"
        placeholder="דוגמא: לא עונה לטלפון"
        ref={reasonRef}
        type="text"
      />
    </>
  );
}

function useFamilySelection() {
  const [selected, setSelected] = useState<Family | undefined>(undefined);
  const setNoSelectedFamily = () => setSelected(undefined);
  const isFamilySelected = typeof selected !== "undefined";
  const selectedFamilyName = isFamilySelected ? selected[familyIdProp] : "";

  return {
    isFamilySelected,
    selected,
    setSelected,
    setNoSelectedFamily,
    selectedFamilyName,
  };
}

export default Families;
