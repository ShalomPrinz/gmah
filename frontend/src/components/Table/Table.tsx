import TableBody, { TableBodyProps } from "./TableBody";
import TableHeader, { TableHeaderProps } from "./TableHeader";

type TableProps = TableHeaderProps & TableBodyProps;

const Table = ({ headerHighlight, ...props }: TableProps) => (
  <table className="table rounded bg-white">
    <TableHeader columns={props.columns} headerHighlight={headerHighlight} />
    <TableBody {...props} />
  </table>
);

export default Table;
