import { ConditionalList } from "../";

import type { TableColumn } from "./types";

interface TableData {
  [key: string]: string;
}

export interface TableBodyProps {
  columns: TableColumn[];
  data: TableData[];
  dataIdProp: string;
}

const TableBody = ({ columns, data, dataIdProp }: TableBodyProps) => {
  const columnCallback = (item: TableData, column: TableColumn) => (
    <td className="align-middle">
      {Object.hasOwn(item, column.path) ? item[column.path] : "שגיאה"}
    </td>
  );

  const rowCallback = (item: TableData) => (
    <tr>
      <ConditionalList
        itemCallback={(column: TableColumn) => columnCallback(item, column)}
        list={columns}
      />
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
