import { ComponentType } from "react";
import { ConditionalList } from "../";

import type { TableColumn } from "./types";

interface TableData {
  [key: string]: string;
}

/** Each column in this dictionary is painted with the result string background color */
type ColumnBackground = {
  [column: string]: (value: any) => string | undefined;
};

export interface TableBodyProps {
  columnBackground?: ColumnBackground;
  columns: TableColumn[];
  data: TableData[];
  dataIdProp: string;
  LastColumn?: ComponentType<{ item: TableData }>;
}

const TableBody = ({
  columnBackground = {},
  columns,
  data,
  dataIdProp,
  LastColumn,
}: TableBodyProps) => {
  const columnCallback = (item: TableData, column: TableColumn) => {
    const className = "align-middle";
    if (column.path in columnBackground) {
      const columnBg = columnBackground[column.path](item[column.path]);
      if (typeof columnBg === "string")
        return <td className={`${className} bg-${columnBg}`}></td>;
    }

    return (
      <td className={className}>
        {Object.hasOwn(item, column.path) ? item[column.path] : "שגיאה"}
      </td>
    );
  };

  const rowCallback = (item: TableData) => (
    <tr>
      <ConditionalList
        itemCallback={(column: TableColumn) => columnCallback(item, column)}
        list={columns}
      />
      {LastColumn && <td>{<LastColumn item={item} />}</td>}
    </tr>
  );

  return (
    <tbody>
      <ConditionalList
        itemCallback={rowCallback}
        list={data}
        keyProp={dataIdProp}
      />
    </tbody>
  );
};

export default TableBody;
