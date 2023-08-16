import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import ConditionalList from "./ConditionalList";
import { getUnique } from "../util";

export type ListItem = string;

interface ColumnListProps {
  list: ListItem[];
  onItemSelect: (item: ListItem) => void;
}

function ColumnList({ list, onItemSelect }: ColumnListProps) {
  const [active, setActive] = useState(list[0] ?? "");

  useEffect(() => onItemSelect(active), [active]);
  useEffect(() => {
    if (list.length > 0 && !list.includes(active)) {
      setActive(list[0]);
    }
  }, [list.length]);

  const itemCallback = (item: ListItem) => {
    const activeStyle = active === item ? " active" : "";
    return (
      <ListGroup.Item
        className={`fs-4 text-center${activeStyle}`}
        action
        eventKey={item}
      >
        {item}
      </ListGroup.Item>
    );
  };

  return (
    <ListGroup key={active} onSelect={(item) => setActive(item ?? "")}>
      <ConditionalList itemAsKey itemCallback={itemCallback} list={list} />
    </ListGroup>
  );
}

function ColumnListWrapper({ list, onItemSelect }: ColumnListProps) {
  const uniqueList = getUnique(list);
  return (
    <ColumnList
      key={`list-${uniqueList[0]}`}
      list={uniqueList}
      onItemSelect={onItemSelect}
    />
  );
}

export default ColumnListWrapper;
