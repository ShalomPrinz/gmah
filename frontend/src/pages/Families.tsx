import { useEffect, useRef, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { RadioMenu, Search, Table } from "../components";
import IconComponent from "../components/Icon";
import { familiesTableHeaders, familyIdProp } from "../modules";
import type { Family } from "../modules";
import { removeFamily, searchFamilies } from "../services";
import { getFormattedToday } from "../util";

const buttons = [
  {
    id: "search-by-name",
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
    text: "מספר פלאפון",
    value: "phone",
  },
  {
    id: "search-by-driver",
    text: "נהג",
    value: "driver",
  },
];

const getButtonTextByValue = (value: string) =>
  buttons.find((b) => b.value === value)?.text || buttons[0].text;

const getHeaderByButtonValue = (value: string) =>
  ({
    name: "שם מלא",
    street: "רחוב",
    phone: "מס' פלאפון",
    driver: "נהג",
  }[value] || "NoSuchSearchOption");

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
        <Row className="mb-3">
          <Col sm="3">
            <h2>חפש באמצעות:</h2>
            <RadioMenu
              buttons={buttons}
              menuId="search-by"
              onSelect={(value: string) => setSearchBy(value)}
            />
          </Col>
          <Col>
            <Search
              onChange={(q: string) => setQuery(q)}
              placeholder={`הכנס ${getButtonTextByValue(searchBy)} של משפחה...`}
            />
          </Col>
          <Col sm="3">
            <h2>מספר תוצאות</h2>
            <p className="text-primary" style={{ fontSize: "50px" }}>
              {families.length}
            </p>
          </Col>
        </Row>
        <Row>
          <Table
            columns={familiesTableHeaders}
            data={families}
            dataIdProp={familyIdProp}
            headerHighlight={getHeaderByButtonValue(searchBy)}
            LastColumn={MenuOpenWrapper(setSelected)}
          />
        </Row>
      </main>
      {isFamilySelected && (
        <div className="bottom-menu p-4 d-flex">
          <span className="fs-3 mx-5 my-auto">{selectedFamilyName}</span>
          <div className="justify-content-center">
            <EditFamily family={selected!} />
            <RemoveFamily onRemove={onFamilyRemove} />
          </div>
          <MenuClose close={setNoSelectedFamily} />
        </div>
      )}
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

function MenuClose({ close }: { close: () => void }) {
  return (
    <button
      className="bottom-menu-item bg-secondary text-white rounded border border-none border-0 fs-3 p-3 me-auto"
      onClick={close}
      type="button"
    >
      <span className="ps-3">סגירת התפריט</span>
      <IconComponent icon="validateFailure" />
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

function useFamiliesSearch(query: string, searchBy: string) {
  const [families, setFamilies] = useState<Family[]>([]);

  const [searchKey, setSearchKey] = useState(0);
  const reloadFamilies = () => setSearchKey((prev) => prev + 1);

  useEffect(() => {
    searchFamilies(query, searchBy)
      .then((res) => setFamilies(res.data.families))
      .catch((error) =>
        console.error("Error occurred while trying to search families", error)
      );
  }, [query, searchBy, searchKey]);

  return { families, reloadFamilies };
}

export default Families;
