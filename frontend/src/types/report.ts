interface Receipt {
  date: string;
  status: boolean;
}

interface DriverReceipt extends Receipt {
  name: string;
}

interface Report {
  name: string;
  active: boolean;
}

export type { DriverReceipt, Receipt, Report };
