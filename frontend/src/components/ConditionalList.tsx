import { cloneElement } from "react";

interface ConditionalListProps {
  /** Warning: Use only when list isn't dynamic */
  indexAsKey?: boolean;
  /** Use when list is of primitive type, and every item is unique */
  itemAsKey?: boolean;
  itemCallback: (item: any) => JSX.Element;
  keyProp?: string;
  list: any[];
}

const ConditionalList = ({
  indexAsKey,
  itemAsKey,
  itemCallback,
  keyProp = "id",
  list,
}: ConditionalListProps) => (
  <>
    {list.map((item, index) => {
      if (!indexAsKey && !itemAsKey && !Object.hasOwn(item, keyProp))
        console.error("No unique id found for item", item);

      const key = itemAsKey ? item : item[keyProp] ?? index;
      return cloneElement(itemCallback(item), { key });
    })}
  </>
);

export default ConditionalList;
