import type { PickupTicket } from "../types";

export const pickupPreparingTickets: PickupTicket[] = [
  { code: "A012", item: "ອາເມຣິກາໂນເຢັນ", wait: "2 ນາທີ", status: "preparing" },
  { code: "A013", item: "ລາເຕ້", wait: "3 ນາທີ", status: "preparing" },
  { code: "A014", item: "ມອກຄ່າ", wait: "4 ນາທີ", status: "preparing" },
  { code: "A015", item: "ຄາຣາເມວມັກຄີອາໂຕ", wait: "5 ນາທີ", status: "preparing" }
];

export const pickupReadyTickets: PickupTicket[] = [
  { code: "A008", item: "ລາເຕ້ເຢັນ", wait: "ພ້ອມ", status: "ready" },
  { code: "A009", item: "ແຟລັດໄວທ໌", wait: "ພ້ອມ", status: "ready" },
  { code: "A010", item: "ຄາປູຊິໂນ", wait: "ພ້ອມ", status: "ready" },
  { code: "A011", item: "ຊັອກໂກແລັດຟຣາບເປ້", wait: "ພ້ອມ", status: "ready" }
];

export const pickupSteps = [
  "ສັ່ງອໍເດີທີ່ເຄົາເຕີ",
  "Barista ຈັດກຽມເຄື່ອງດື່ມ",
  "ກວດເບິ່ງເລກຄິວໃນຈໍ",
  "ຮັບເຄື່ອງດື່ມທີ່ເຄົາເຕີ"
];
