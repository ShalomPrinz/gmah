import type { NonEmptyString } from "./string";

type Driver = {
  name: string;
  phone: string;
};

interface NoManagerDriver {
  name: string;
  count: number;
}

interface Manager {
  id: string;
  name: NonEmptyString;
  drivers: Driver[];
}

export type { Driver, Manager, NoManagerDriver };
