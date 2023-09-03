import { useState } from "react";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { BottomMenu, getSearchBy, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import { File, useFamiliesSearch } from "../hooks";
import {
  familiesHistoryTableHeaders,
  type Family,
  familyIdProp,
} from "../modules";
import { permanentRemoveFamily, restoreFamily } from "../services";

const buttons = [
  {
    id: "search-by-name",
    header: "שם מלא",
    text: "שם",
    value: "name",
  },
  {
    id: "search-by-r11r",
    text: "ממליץ",
    value: "r11r",
  },
];

const { getSearchByHeader, getSearchByText } = getSearchBy(buttons);

async function restoreFamilyWrapper(
  familyName: string,
  onRestoreSuccess: () => void
) {
  return restoreFamily(familyName)
    .then(() => {
      toast.success(`שחזרת את משפחת ${familyName} מהסטוריית הנתמכים`, {
        toastId: `restoreSuccess:${familyName}`,
      });
      onRestoreSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו לשחזר את המשפחה ${familyName} מהסטוריית הנתמכים: ${response.data.description}`,
        {
          toastId: `restoreFailure:${familyName}`,
        }
      );
    });
}

async function permanentRemoveFamilyWrapper(
  familyName: string,
  onPermanentRemoveSuccess: () => void
) {
  return permanentRemoveFamily(familyName)
    .then(() => {
      toast.success(`הסרת את משפחת ${familyName} מהסטוריית הנתמכים לצמיתות`, {
        toastId: `permanentRemoveSuccess:${familyName}`,
      });
      onPermanentRemoveSuccess();
    })
    .catch(({ response }) => {
      toast.error(
        `לא הצלחנו להסיר את המשפחה ${familyName} לצמיתות מהסטוריית הנתמכים: ${response.data.description}`,
        {
          toastId: `permanentRemoveFailure:${familyName}`,
        }
      );
    });
}

function FamiliesHistory() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families, reloadFamilies } = useFamiliesSearch(
    query,
    searchBy,
    File.FAMILIES_HISTORY
  );

  const {
    isFamilySelected,
    selectedFamilyName,
    setNoSelectedFamily,
    setSelected,
  } = useFamilySelection();

  const onFamilyRestore = (familyName: string) => () => {
    restoreFamilyWrapper(familyName, reloadFamilies);
    setNoSelectedFamily();
  };

  const onFamilyPermanentRemove = (familyName: string) => () => {
    permanentRemoveFamilyWrapper(familyName, reloadFamilies);
    setNoSelectedFamily();
  };

  return (
    <>
      <main className="container text-center mx-auto">
        <Row>
          <h1 className="mt-5 mb-4">חיפוש בהסטוריית המשפחות</h1>
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
            columns={familiesHistoryTableHeaders}
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
        <RestoreFamily onRestore={onFamilyRestore(selectedFamilyName)} />
        <PermanentRemoveFamily
          onRemove={onFamilyPermanentRemove(selectedFamilyName)}
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

function RestoreFamily({ onRestore }: { onRestore: () => void }) {
  return (
    <button
      className="bottom-menu-item bg-success text-white rounded border border-none border-0 fs-3 p-3"
      onClick={onRestore}
      type="button"
    >
      <span className="ps-2">שחזור</span>
      <IconComponent flipHorizontal icon="restoreItem" />
    </button>
  );
}

function PermanentRemoveFamily({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      className="bottom-menu-item bg-danger text-white rounded border border-none border-0 fs-3 p-3"
      onClick={onRemove}
      type="button"
    >
      <span className="ps-2">הסרה לצמיתות</span>
      <IconComponent icon="removeItem" />
    </button>
  );
}

function useFamilySelection() {
  const [selected, setSelected] = useState<Family | undefined>(undefined);
  const setNoSelectedFamily = () => setSelected(undefined);
  const isFamilySelected = typeof selected !== "undefined";
  const selectedFamilyName = isFamilySelected ? selected[familyIdProp] : "";

  return {
    isFamilySelected,
    setSelected,
    setNoSelectedFamily,
    selectedFamilyName,
  };
}

export default FamiliesHistory;
