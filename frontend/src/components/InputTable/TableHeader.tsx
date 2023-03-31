import { ConditionalList } from "../";
import type { TableColumn } from "./types";

export interface TableHeaderProps {
  columns: TableColumn[];
  display: boolean;
}

const TableHeader = ({ columns, display }: TableHeaderProps) => {
  const headerCallback = ({ path }: TableColumn) => {
    return <th className="fs-5 p-3">{path}</th>;
  };

  return (
    <thead>
      <tr>
        {display && (
          <>
            <th /> {/* Display row index before row content */}
            <ConditionalList itemCallback={headerCallback} list={columns} />
          </>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
