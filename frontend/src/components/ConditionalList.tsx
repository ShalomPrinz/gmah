import { cloneElement } from "react";

interface ConditionalListProps {
  /** Warning: Use only when list isn't dynamic */
  indexAsKey?: boolean;
  itemCallback: (item: any) => JSX.Element;
  list: any[];
}

const ConditionalList = ({
  indexAsKey,
  itemCallback,
  list,
}: ConditionalListProps) => (
  <>
    {list.map((item, index) => {
      if (!indexAsKey && !Object.hasOwn(item, "id"))
        console.error("No unique id found for item", item);
      return cloneElement(itemCallback(item), { key: item.id || index });
    })}
  </>
);

export default ConditionalList;
