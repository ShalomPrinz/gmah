import { ConditionalList } from "../";
import type { TableColumn } from "./types";

export interface TableHeaderProps {
  columns: TableColumn[];
  hasLastColumn?: boolean;
  headerHighlight?: string;
  numberedTable?: boolean;
}

const TableHeader = ({
  columns,
  hasLastColumn,
  headerHighlight,
  numberedTable,
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
        {numberedTable && <th />}
        <ConditionalList itemCallback={headerCallback} list={columns} />
        {hasLastColumn && <th />}
      </tr>
    </thead>
  );
};

export default TableHeader;
