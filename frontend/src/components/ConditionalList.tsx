import { cloneElement } from "react";

interface ConditionalListProps {
  /** Warning: Use only when list isn't dynamic */
  indexAsKey?: boolean;
  itemCallback: (item: any) => JSX.Element;
  keyProp?: string;
  list: any[];
}

const ConditionalList = ({
  indexAsKey,
  itemCallback,
  keyProp = "id",
  list,
}: ConditionalListProps) => (
  <>
    {list.map((item, index) => {
      if (!indexAsKey && !Object.hasOwn(item, keyProp))
        console.error("No unique id found for item", item);
      return cloneElement(itemCallback(item), { key: item[keyProp] ?? index });
    })}
  </>
);

export default ConditionalList;
