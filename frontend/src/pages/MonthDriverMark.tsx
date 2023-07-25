interface MonthDriverMarkProps {
  driverName: string;
  reportName: string;
}

function MonthDriverMark({ driverName, reportName }: MonthDriverMarkProps) {
  return <h2 className="mt-4">{driverName}</h2>;
}

export default MonthDriverMark;
