import { ConditionalList } from "../";
import type { TableColumn } from "./types";

export interface TableHeaderProps {
  columns: TableColumn[];
  headerHighlight: string;
}

const TableHeader = ({ columns, headerHighlight }: TableHeaderProps) => {
  const headerCallback = ({ path }: TableColumn) => {
    const className = `fs-5 p-3${
      headerHighlight === path ? " bg-warning" : ""
    }`;
    return <th className={className}>{path}</th>;
  };

  return (
    <thead>
      <tr>
        <ConditionalList itemCallback={headerCallback} list={columns} />
      </tr>
    </thead>
  );
};

export default TableHeader;
