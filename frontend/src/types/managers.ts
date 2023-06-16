type Driver = {
  name: string;
  phone: string;
};

interface Manager {
  id: string;
  name: string;
  drivers: Driver[];
}

export type { Driver, Manager };
