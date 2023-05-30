import TableBody, { TableBodyProps } from "./TableBody";
import TableHeader, { TableHeaderProps } from "./TableHeader";

type TableProps = TableHeaderProps & TableBodyProps;

const Table = ({ headerHighlight, ...props }: TableProps) => {
  const hasLastColumn = typeof props.LastColumn !== "undefined";

  return (
    <table className="table rounded bg-white">
      <TableHeader
        columns={props.columns}
        hasLastColumn={hasLastColumn}
        headerHighlight={headerHighlight}
      />
      <TableBody {...props} />
    </table>
  );
};

export default Table;
