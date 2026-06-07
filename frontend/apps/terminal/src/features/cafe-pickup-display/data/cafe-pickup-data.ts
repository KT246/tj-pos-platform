import type { PickupTicket } from "../types";

export const pickupPreparingTickets: PickupTicket[] = [
  { code: "A012", item: "Iced Americano", wait: "2 mins", status: "preparing" },
  { code: "A013", item: "Latte", wait: "3 mins", status: "preparing" },
  { code: "A014", item: "Mocha", wait: "4 mins", status: "preparing" },
  { code: "A015", item: "Caramel Macchiato", wait: "5 mins", status: "preparing" }
];

export const pickupReadyTickets: PickupTicket[] = [
  { code: "A008", item: "Iced Latte", wait: "ພ້ອມ", status: "ready" },
  { code: "A009", item: "Flat White", wait: "ພ້ອມ", status: "ready" },
  { code: "A010", item: "Cappuccino", wait: "ພ້ອມ", status: "ready" },
  { code: "A011", item: "Chocolate Frappe", wait: "ພ້ອມ", status: "ready" }
];

export const pickupSteps = [
  "ສັ່ງ Order ທີ່ counter",
  "ທີມ Barista ຈັດກຽມເຄື່ອງດື່ມ",
  "ກວດເບິ່ງເລກຄິວໃນຈໍ",
  "ຮັບເຄື່ອງດື່ມ ແລະ enjoy"
];
