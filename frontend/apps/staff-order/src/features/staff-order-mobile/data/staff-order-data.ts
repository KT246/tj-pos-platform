import type {
  DiningTable,
  StaffOrderLine,
  StaffOrderProduct,
  StaffOrderRecord
} from "../types";

export const staffName = "Somchai P.";
export const staffId = "STF-0021";
export const staffRole = "ພະນັກງານບໍລິການ";
export const selectedBranch = "TJ Cafe Vientiane";
export const staffDevice = "ອຸປະກອນຮັບອໍເດີ 03";

export const branchOptions = [
  { name: "TJ Cafe Vientiane", location: "Vientiane, Laos" },
  { name: "TJ Cafe Pakse", location: "Pakse, Laos" },
  { name: "TJ Cafe Savannakhet", location: "Savannakhet, Laos" }
];

export const staffCategories = [
  { id: "all", label: "ທັງໝົດ" },
  { id: "ກາເຟ", label: "ກາເຟ" },
  { id: "ຊາ", label: "ຊາ" },
  { id: "ເບເກີຣີ", label: "ເບເກີຣີ" },
  { id: "ອາຫານ", label: "ອາຫານ" },
  { id: "add-ons", label: "ເພີ່ມເຕີມ" }
];

const staffBaseProducts: StaffOrderProduct[] = [
  {
    id: "iced-latte",
    name: "ລາເຕ້ເຢັນ",
    category: "ກາເຟ",
    sku: "CF-1001",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "americano",
    name: "ອາເມຣິກາໂນ",
    category: "ກາເຟ",
    sku: "CF-1002",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cappuccino",
    name: "ຄາປູຊິໂນ",
    category: "ກາເຟ",
    sku: "CF-1003",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "thai-milk-tea",
    name: "ຊານົມໄທ",
    category: "ຊາ",
    sku: "TE-2001",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "croissant",
    name: "ຄຣົວຊອງ",
    category: "ເບເກີຣີ",
    sku: "BK-3001",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "chocolate-cake",
    name: "ເຄັກຊັອກໂກແລັດ",
    category: "ເບເກີຣີ",
    sku: "BK-3002",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "club-sandwich",
    name: "ແຊນວິດຄລັບ",
    category: "ອາຫານ",
    sku: "FD-4001",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "mineral-water",
    name: "ນ້ຳດື່ມ",
    category: "ເຄື່ອງດື່ມ",
    sku: "BV-5001",
    price: 10000,
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "cola-can",
    name: "ໂຄລາກະປ໋ອງ",
    category: "ເຄື່ອງດື່ມ",
    sku: "BV-5002",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "sprite-can",
    name: "ສະໄປຣທ໌ກະປ໋ອງ",
    category: "ເຄື່ອງດື່ມ",
    sku: "BV-5003",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "orange-juice",
    name: "ນ້ຳສົ້ມ",
    category: "ບໍ່ແມ່ນກາເຟ",
    sku: "NC-6001",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=360&q=80"
  },
  {
    id: "green-tea",
    name: "ຊາຂຽວ",
    category: "ຊາ",
    sku: "TE-2002",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=360&q=80"
  }
];

export const staffProducts: StaffOrderProduct[] = staffBaseProducts.map(
  (product, index) => ({
    ...product,
    category: product.category === "ເບເກີຣີ" ? "ເບເກີຣີ" : product.category,
    label:
      index === 0 || index === 1
        ? "ນິຍົມ"
        : index === 2
          ? "ໃໝ່"
          : index === 4
            ? "ເບເກີຣີ"
            : index === 6
              ? "ແນະນຳ"
              : undefined
  })
);

export const staffTables: DiningTable[] = [
  { id: "T01", seats: 2, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T02", seats: 4, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T03", seats: 4, area: "ພາຍໃນ", status: "ມີລູກຄ້າ", elapsed: "00:45" },
  { id: "T04", seats: 2, area: "ພາຍໃນ", status: "ວ່າງ" },
  { id: "T05", seats: 6, area: "ພາຍໃນ", status: "ມີລູກຄ້າ", elapsed: "01:15" },
  { id: "T06", seats: 4, area: "ພາຍນອກ", status: "ວ່າງ" },
  { id: "T07", seats: 2, area: "ພາຍນອກ", status: "ວ່າງ" },
  { id: "T08", seats: 4, area: "ຫ້ອງ VIP", status: "ວ່າງ" },
  { id: "T09", seats: 2, area: "ຫ້ອງ VIP", status: "ຈອງໄວ້", elapsed: "15:30" },
  { id: "T10", seats: 6, area: "ລານນອກ", status: "ວ່າງ" }
];

export const starterStaffCart: StaffOrderLine[] = [
  {
    id: "staff-line-iced-latte",
    productId: "iced-latte",
    name: "ລາເຕ້ເຢັນ",
    category: "ກາເຟ",
    price: 28000,
    quantity: 1,
    image: staffProducts[0].image,
    size: "ຂະໜາດປົກກະຕິ",
    milk: "ນົມ Full Cream",
    sugar: "ຫວານນ້ອຍ",
    ice: "ນ້ຳກ້ອນປົກກະຕິ",
    note: "ຫວານນ້ອຍ, ເພີ່ມ shot"
  },
  {
    id: "staff-line-hot-latte",
    productId: "hot-latte",
    name: "ລາເຕ້ຮ້ອນ",
    category: "ກາເຟ",
    price: 27000,
    quantity: 1,
    image: staffProducts[1].image,
    size: "ຂະໜາດປົກກະຕິ",
    milk: "ນົມ Full Cream",
    sugar: "ປົກກະຕິ",
    ice: "ບໍ່ໃສ່ນ້ຳກ້ອນ"
  },
  {
    id: "staff-line-croissant",
    productId: "croissant",
    name: "ຄຣົວຊອງ",
    category: "ເບເກີຣີ",
    price: 18000,
    quantity: 1,
    image: staffProducts[4].image,
    size: "ຫອມເນີຍ",
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
    status: "ກຳລັງກຽມ",
    items: 3,
    total: 72000,
    elapsed: "12 min",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    lines: starterStaffCart
  },
  {
    id: "#SO-1055",
    tableId: "T05",
    guests: 2,
    status: "ສົ່ງແລ້ວ",
    items: 4,
    total: 96000,
    elapsed: "18 min",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    lines: starterStaffCart.slice(0, 2)
  },
  {
    id: "#SO-1054",
    tableId: "T08",
    guests: 1,
    status: "ພ້ອມເສີບ",
    items: 2,
    total: 45000,
    elapsed: "22 min",
    type: "ສັ່ງກັບບ້ານ",
    lines: starterStaffCart.slice(1, 3)
  },
  {
    id: "#SO-1053",
    tableId: "T10",
    guests: 5,
    status: "ລໍຖ້າອອກບິນ",
    items: 5,
    total: 118000,
    elapsed: "35 min",
    type: "ນັ່ງກິນທີ່ຮ້ານ",
    lines: starterStaffCart
  }
];
