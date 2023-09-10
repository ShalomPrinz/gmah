import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { RadioMenu, Search } from "../components";

interface Button {
  id: string;
  header?: string;
  text: string;
  value: string;
}

function getSearchBy(buttons: Button[]) {
  const getButtonByValue = (value: string) =>
    buttons.find((b) => b.value === value) || buttons[0];

  const getSearchByText = (value: string) => getButtonByValue(value).text;

  const getSearchByHeader = (value: string) => {
    const button = getButtonByValue(value);
    return button.header || button.text;
  };

  return {
    getSearchByText,
    getSearchByHeader,
  };
}

interface SearchRowProps {
  marginBottom?: "3" | "1";
  onQueryChange: (query: string) => void;
  onSearchByChange: (searchBy: string) => void;
  queryPlaceholder: string;
  resultCount?: number;
  ResultDisplay?: JSX.Element;
  searchBy: Button[];
}

function SearchRow({
  marginBottom = "3",
  onQueryChange,
  onSearchByChange,
  queryPlaceholder,
  resultCount,
  ResultDisplay,
  searchBy,
}: SearchRowProps) {
  const hasCustomResultDisplay = typeof ResultDisplay !== "undefined";
  const disableResultDisplay = typeof resultCount === "undefined";

  const searchByMenu = disableResultDisplay ? "4" : "3";
  const searchBoxWidth = disableResultDisplay ? "8" : "6";

  return (
    <Row className={`mb-${marginBottom}`}>
      <Col sm={searchByMenu}>
        <h2>חפש באמצעות:</h2>
        <RadioMenu
          buttons={searchBy}
          menuId="search-by"
          onSelect={onSearchByChange}
        />
      </Col>
      <Col sm={searchBoxWidth}>
        <Search onChange={onQueryChange} placeholder={queryPlaceholder} />
      </Col>
      {!disableResultDisplay && (
        <Col sm="3">
          {hasCustomResultDisplay ? (
            ResultDisplay
          ) : (
            <>
              <h2>מספר תוצאות</h2>
              <p className="text-primary" style={{ fontSize: "50px" }}>
                {resultCount ?? "שגיאה"}
              </p>
            </>
          )}
        </Col>
      )}
    </Row>
  );
}

export default SearchRow;
export { getSearchBy };
