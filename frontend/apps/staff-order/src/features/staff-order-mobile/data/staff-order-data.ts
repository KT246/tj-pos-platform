import type {
  DiningTable,
  StaffOrderLine,
  StaffOrderProduct,
  StaffOrderRecord
} from "../types";

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

const staffBaseProducts: StaffOrderProduct[] = [
  {
    id: "iced-latte",
    name: "Iced Latte",
    category: "coffee",
    sku: "CF-1001",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "americano",
    name: "Americano",
    category: "coffee",
    sku: "CF-1002",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "coffee",
    sku: "CF-1003",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "thai-milk-tea",
    name: "Thai Milk Tea",
    category: "tea",
    sku: "TE-2001",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "croissant",
    name: "Croissant",
    category: "pastry",
    sku: "BK-3001",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake",
    category: "pastry",
    sku: "BK-3002",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    category: "snacks",
    sku: "FD-4001",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    category: "beverages",
    sku: "BV-5001",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cola-can",
    name: "Cola Can",
    category: "beverages",
    sku: "BV-5002",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "sprite-can",
    name: "Sprite Can",
    category: "beverages",
    sku: "BV-5003",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "orange-juice",
    name: "Orange Juice",
    category: "non-coffee",
    sku: "NC-6001",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "green-tea",
    name: "Green Tea",
    category: "tea",
    sku: "TE-2002",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=360&q=80"
  }
];

export const staffProducts: StaffOrderProduct[] = staffBaseProducts.map(
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

export const staffTables: DiningTable[] = [
  { id: "T01", seats: 2, area: "Indoor", status: "Available" },
  { id: "T02", seats: 4, area: "Indoor", status: "Available" },
  { id: "T03", seats: 4, area: "Indoor", status: "Occupied", elapsed: "00:45" },
  { id: "T04", seats: 2, area: "Indoor", status: "Available" },
  { id: "T05", seats: 6, area: "Indoor", status: "Occupied", elapsed: "01:15" },
  { id: "T06", seats: 4, area: "Outdoor", status: "Available" },
  { id: "T07", seats: 2, area: "Outdoor", status: "Available" },
  { id: "T08", seats: 4, area: "VIP Room", status: "Available" },
  { id: "T09", seats: 2, area: "VIP Room", status: "Reserved", elapsed: "15:30" },
  { id: "T10", seats: 6, area: "Terrace", status: "Available" }
];

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
