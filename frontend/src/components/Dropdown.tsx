import Dropdown from "react-bootstrap/Dropdown";
import ConditionalList from "./ConditionalList";

export interface Option {
  eventKey: string;
  value: string;
}

interface AppDropdownProps {
  onSelect: (eventKey: string | null) => void;
  options: Option[];
  title: string;
}

function AppDropdown({ onSelect, options, title }: AppDropdownProps) {
  const optionCallback = ({ eventKey, value }: Option) => (
    <Dropdown.Item eventKey={eventKey}>
      <span className="fs-4 text-center">{value}</span>
    </Dropdown.Item>
  );
  return (
    <Dropdown onSelect={onSelect}>
      <Dropdown.Toggle className="fs-4 p-2" variant="primary">
        <span className="ms-3 me-2">{title}</span>
      </Dropdown.Toggle>
      {options.length > 0 && (
        <Dropdown.Menu className="text-center">
          <ConditionalList
            list={options}
            itemCallback={optionCallback}
            keyProp="eventKey"
          />
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
}

export default AppDropdown;
