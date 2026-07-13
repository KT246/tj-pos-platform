export type CustomerStatus = "active" | "locked";

export type CafeCustomer = {
  id: string;
  code: string;
  name: string;
  phone: string;
  points: number;
  status: CustomerStatus;
  totalSpent: number;
  ordersCount: number;
  lastOrderAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerKpi = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  tone: "brown" | "green" | "amber" | "purple";
};

export type CustomerListResponse = {
  customers: CafeCustomer[];
  kpis: CustomerKpi[];
};

export type SaveCustomerBody = {
  name?: string;
  phone?: string;
  status?: CustomerStatus;
};

export type DeleteCustomerResponse = {
  id: string;
  deleted: true;
};
