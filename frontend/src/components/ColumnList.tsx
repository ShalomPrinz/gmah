import ListGroup from "react-bootstrap/ListGroup";
import ConditionalList from "./ConditionalList";
import { useEffect, useState } from "react";

export interface ListItem {
  title: string;
}

interface ColumnListProps {
  list: ListItem[];
  onItemSelect: (title: string) => void;
}

function ColumnList({ list, onItemSelect }: ColumnListProps) {
  const [active, setActive] = useState(list[0]?.title ?? "");

  useEffect(() => onItemSelect(active), [active]);

  const itemCallback = ({ title }: ListItem) => {
    const activeStyle = active === title ? " active" : "";
    return (
      <ListGroup.Item
        className={`fs-4 text-center${activeStyle}`}
        action
        eventKey={title}
      >
        {title}
      </ListGroup.Item>
    );
  };

  return (
    <ListGroup onSelect={(title) => setActive(title ?? "")}>
      <ConditionalList
        list={list}
        itemCallback={itemCallback}
        keyProp="title"
      />
    </ListGroup>
  );
}

export default ColumnList;
