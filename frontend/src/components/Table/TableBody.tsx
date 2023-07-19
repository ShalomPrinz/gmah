import { ComponentType } from "react";
import { ConditionalList } from "../";

import type { TableColumn } from "./types";

interface TableData {
  [key: string]: string;
}

/** Each column in this dictionary is rendered with its callback result */
type ColumnMapper = {
  [column: string]: (value: any) => {
    background?: string | undefined;
    text?: string | undefined;
  };
};

export interface TableBodyProps {
  columnMapper?: ColumnMapper;
  columns: TableColumn[];
  data: TableData[];
  dataIdProp: string;
  LastColumn?: ComponentType<{ item: TableData }>;
}

const TableBody = ({
  columnMapper = {},
  columns,
  data,
  dataIdProp,
  LastColumn,
}: TableBodyProps) => {
  const columnCallback = (item: TableData, column: TableColumn) => {
    const baseClassName = "align-middle";

    if (column.path in columnMapper) {
      const { background, text } = columnMapper[column.path](item[column.path]);
      if (typeof background === "string")
        return <td className={`${baseClassName} bg-${background}`}></td>;
      if (typeof text === "string")
        return <td className={baseClassName}>{text}</td>;
    }

    return (
      <td className={baseClassName}>
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
