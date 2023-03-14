import TableBody, { TableBodyProps } from "./TableBody";
import TableHeader from "./TableHeader";

const Table = ({ columns, ...props }: TableBodyProps) => (
  <table className="table rounded bg-white">
    <TableHeader columns={columns} />
    <TableBody columns={columns} {...props} />
  </table>
);

export default Table;
