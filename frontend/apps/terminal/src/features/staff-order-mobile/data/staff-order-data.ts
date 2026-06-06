import { products, tables } from "../../pos-terminal/data/mock-pos-data";
import type { DiningTable } from "../../pos-terminal/types";
import type { StaffOrderLine, StaffOrderProduct, StaffOrderRecord } from "../types";

export const staffName = "Somchai P.";
export const staffId = "STF-0021";
export const staffRole = "Service Staff";
export const selectedBranch = "TJ Cafe Vientiane";
export const staffDevice = "Order Device 03";

export const branchOptions = [
  { name: "TJ Cafe Vientiane", location: "Vientiane, Laos" },
  { name: "TJ Cafe Pakse", location: "Pakse, Laos" },
  { name: "TJ Cafe Savannakhet", location: "Savannakhet, Laos" }
];

export const staffCategories = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "pastry", label: "Bakery" },
  { id: "snacks", label: "Meals" },
  { id: "add-ons", label: "Add-ons" }
];

export const staffProducts: StaffOrderProduct[] = products.slice(0, 12).map(
  (product, index) => ({
    ...product,
    category: product.category === "pastry" ? "pastry" : product.category,
    label:
      index === 0 || index === 1
        ? "Popular"
        : index === 2
          ? "New"
          : index === 4
            ? "Bakery"
            : index === 6
              ? "Top Pick"
              : undefined
  })
);

export const staffTables: DiningTable[] = tables.slice(0, 10);

export const starterStaffCart: StaffOrderLine[] = [
  {
    id: "staff-line-iced-latte",
    productId: "iced-latte",
    name: "Iced Latte",
    category: "Coffee",
    price: 28000,
    quantity: 1,
    image: staffProducts[0].image,
    size: "Regular Size",
    milk: "Full Cream Milk",
    sugar: "Less Sugar",
    ice: "Regular Ice",
    note: "Less sugar, extra shot"
  },
  {
    id: "staff-line-hot-latte",
    productId: "hot-latte",
    name: "Hot Latte",
    category: "Coffee",
    price: 27000,
    quantity: 1,
    image: staffProducts[1].image,
    size: "Regular Size",
    milk: "Full Cream Milk",
    sugar: "Normal",
    ice: "No Ice"
  },
  {
    id: "staff-line-croissant",
    productId: "croissant",
    name: "Croissant",
    category: "Bakery",
    price: 18000,
    quantity: 1,
    image: staffProducts[4].image,
    size: "Buttery",
    milk: "-",
    sugar: "-",
    ice: "-"
  }
];

export const activeStaffOrders: StaffOrderRecord[] = [
  {
    id: "#SO-1056",
    tableId: "T03",
    guests: 3,
    status: "Preparing",
    items: 3,
    total: 72000,
    elapsed: "12 min",
    type: "Dine In",
    lines: starterStaffCart
  },
  {
    id: "#SO-1055",
    tableId: "T05",
    guests: 2,
    status: "Sent",
    items: 4,
    total: 96000,
    elapsed: "18 min",
    type: "Dine In",
    lines: starterStaffCart.slice(0, 2)
  },
  {
    id: "#SO-1054",
    tableId: "T08",
    guests: 1,
    status: "Ready to Serve",
    items: 2,
    total: 45000,
    elapsed: "22 min",
    type: "Take Away",
    lines: starterStaffCart.slice(1, 3)
  },
  {
    id: "#SO-1053",
    tableId: "T10",
    guests: 5,
    status: "Waiting Bill",
    items: 5,
    total: 118000,
    elapsed: "35 min",
    type: "Dine In",
    lines: starterStaffCart
  }
];
