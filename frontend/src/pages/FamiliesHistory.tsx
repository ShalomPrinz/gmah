import { useState } from "react";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";

import { getSearchBy, SearchRow, Table } from "../components";
import IconComponent from "../components/Icon";
import { useFamiliesSearch } from "../hooks";
import { familiesHistoryTableHeaders, familyIdProp } from "../modules";
import { restoreFamily } from "../services";

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

function FamiliesHistory() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const { families, reloadFamilies } = useFamiliesSearch(query, searchBy, true);

  const RestoreFamily = ({ item }: { item: any }) => (
    <button
      className="fs-5 p-2 rounded bg-success text-white border border-none border-0"
      onClick={() => restoreFamilyWrapper(item[familyIdProp], reloadFamilies)}
      type="button"
    >
      <span className="ps-2">שחזור</span>
      <IconComponent flipHorizontal icon="restoreItem" />
    </button>
  );

  return (
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
          LastColumn={RestoreFamily}
        />
      </Row>
    </main>
  );
}

export default FamiliesHistory;
