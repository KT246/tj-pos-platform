export type StaffOrderScreen =
  | "login"
  | "tables"
  | "menu"
  | "customize"
  | "review"
  | "success"
  | "orders"
  | "profile";

export type StaffOrderLine = {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  milk: string;
  sugar: string;
  ice: string;
  note?: string;
};

export type StaffOrderRecord = {
  id: string;
  tableId: string;
  guests: number;
  status: "ກຳລັງກຽມ" | "ສົ່ງແລ້ວ" | "ພ້ອມເສີບ" | "ລໍຖ້າອອກບິນ";
  items: number;
  total: number;
  elapsed: string;
  type: "ນັ່ງກິນທີ່ຮ້ານ" | "ສັ່ງກັບບ້ານ";
  lines: StaffOrderLine[];
};

export type StaffOrderProduct = {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  image: string;
  badge?: string;
  label?: string;
};

export type DiningTable = {
  id: string;
  seats: number;
  area: "ພາຍໃນ" | "ພາຍນອກ" | "ຫ້ອງ VIP" | "ລານນອກ";
  status: "ວ່າງ" | "ມີລູກຄ້າ" | "ຈອງໄວ້";
  elapsed?: string;
};
