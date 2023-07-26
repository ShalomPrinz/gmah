interface Receipt {
  date: string;
  status: boolean;
}

interface DriverReceipt extends Receipt {
  name: string;
}

export type { DriverReceipt, Receipt };
