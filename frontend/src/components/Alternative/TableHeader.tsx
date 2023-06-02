import { ConditionalList } from "../";
import type { TableColumn } from "./types";

export interface TableHeaderProps {
  columns: TableColumn[];
}

const TableHeader = ({ columns }: TableHeaderProps) => {
  const headerCallback = ({ label }: TableColumn) => {
    return <th className="fs-5 p-3">{label}</th>;
  };

  return (
    <thead>
      <tr>
        <>
          <th />
          {/* Display row index before row content */}
          <ConditionalList itemCallback={headerCallback} list={columns} />
        </>
      </tr>
    </thead>
  );
};

export default TableHeader;
