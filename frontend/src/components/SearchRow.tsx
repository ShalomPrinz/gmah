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
  onQueryChange: (query: string) => void;
  onSearchByChange: (searchBy: string) => void;
  queryPlaceholder: string;
  resultCount: number;
  searchBy: Button[];
}

function SearchRow({
  onQueryChange,
  onSearchByChange,
  queryPlaceholder,
  resultCount,
  searchBy,
}: SearchRowProps) {
  return (
    <Row className="mb-3">
      <Col sm="3">
        <h2>חפש באמצעות:</h2>
        <RadioMenu
          buttons={searchBy}
          menuId="search-by"
          onSelect={onSearchByChange}
        />
      </Col>
      <Col>
        <Search onChange={onQueryChange} placeholder={queryPlaceholder} />
      </Col>
      <Col sm="3">
        <h2>מספר תוצאות</h2>
        <p className="text-primary" style={{ fontSize: "50px" }}>
          {resultCount}
        </p>
      </Col>
    </Row>
  );
}

export default SearchRow;
export { getSearchBy };
