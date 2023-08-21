import type { NonEmptyString } from "./string";

type Driver = {
  name: string;
  phone: string;
  print?: string;
};

interface NoManagerDriver {
  name: string;
  count: number;
}

interface Manager {
  id: string;
  name: NonEmptyString;
  drivers: Driver[];
  print?: string;
}

export type { Driver, Manager, NoManagerDriver };
