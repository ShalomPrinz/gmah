import { ConditionalList } from "../";
import type { TableColumn } from "./types";

export interface TableHeaderProps {
  columns: TableColumn[];
  hasLastColumn?: boolean;
  headerHighlight?: string;
}

const TableHeader = ({
  columns,
  hasLastColumn,
  headerHighlight,
}: TableHeaderProps) => {
  const headerCallback = ({ label, path }: TableColumn) => {
    const className = `fs-5 p-3${
      headerHighlight === path ? " bg-warning" : ""
    }`;
    return <th className={className}>{label ?? path}</th>;
  };

  return (
    <thead>
      <tr>
        <ConditionalList itemCallback={headerCallback} list={columns} />
        {hasLastColumn && <th />}
      </tr>
    </thead>
  );
};

export default TableHeader;
