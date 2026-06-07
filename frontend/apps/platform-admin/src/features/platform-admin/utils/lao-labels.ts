import type { ReactNode } from "react";

const laoLabels: Record<string, string> = {
  "Platform Admin": "Platform Admin",
  "Platform Admin Dashboard": "ແດຊບອດ Platform Admin",
  "Business ID": "Business ID",
  "Business Slug": "Business Slug",
  "Phone": "ເບີໂທ",
  "Website": "ເວັບໄຊ",
  "Address": "ທີ່ຢູ່",
  "Email": "Email",
  "Support Email": "Support Email",
  "Last Login IP": "Last Login IP",
  "2FA": "2FA",
  "Profile": "Profile",
  "Profile & ຄວາມປອດໄພ": "Profile & ຄວາມປອດໄພ",
  "Two-Factor Authentication": "Two-Factor Authentication",
  "API Keys": "API Keys",
  "Sessions": "Sessions",
  "Audit Log": "Audit Log",
  "API Rate Limit": "API Rate Limit",
  "Database": "Database",
  "Queue Worker": "Queue Worker",
  "Redis": "Redis",
  "Resource": "Resource",
  "Channel": "Channel",
  "Trigger": "Trigger",
  "Payment ID": "Payment ID",
  "Provider / Bank": "ຜູ້ໃຫ້ບໍລິການ / ທະນາຄານ",
  "Payment Gateways": "Payment Gateways",
  "Settlement & Fees": "Settlement & ຄ່າທຳນຽມ",
  "POS Payment": "POS Payment",
  "Cash": "ເງິນສົດ",
  "Card": "ບັດ",
  "Bank Transfer": "ໂອນທະນາຄານ",
  "Bank / QR": "ທະນາຄານ / QR",
  "Mobile Banking": "Mobile Banking",
  "In-Store": "ທີ່ຮ້ານ",
  "Card Network": "Card Network",
  "POS Terminal": "POS Terminal",
  "Payment QR ບໍ່ສະແດງ": "Payment QR ບໍ່ສະແດງ",
  "Printer ບໍ່ພິມບິນ": "Printer ບໍ່ພິມບິນ",
  "Ticket detail, conversation, internal notes ແລະ resolution steps.": "ລາຍລະອຽດ Ticket, ການສົນທະນາ, note ພາຍໃນ ແລະ ຂັ້ນຕອນແກ້ໄຂ.",
  "User profile, business access, login history ແລະ security status.": "Profile ຜູ້ໃຊ້, ສິດເຂົ້າເຖິງທຸລະກິດ, ປະຫວັດ login ແລະ ສະຖານະຄວາມປອດໄພ.",
  "ຈັດການ owner, staff ແລະ platform user accounts.": "ຈັດການເຈົ້າຂອງ, ພະນັກງານ ແລະ ບັນຊີຜູ້ໃຊ້ platform.",
  "ຈັດການ pricing plans, limits ແລະ subscription rules.": "ຈັດການແພັກເກດລາຄາ, ຂໍ້ຈຳກັດ ແລະ ກົດການສະໝັກໃຊ້.",
  "ຕິດຕາມ plan, renewal date, payment status ແລະ lifecycle.": "ຕິດຕາມແພັກເກດ, ວັນຕໍ່ອາຍຸ, ສະຖານະຊຳລະ ແລະ lifecycle.",
  "ຕິດຕາມ subscription payments, manual confirmation ແລະ transaction status.": "ຕິດຕາມການຊຳລະ subscription, ການຢືນຢັນແບບ manual ແລະ ສະຖານະ transaction.",
  "ຈັດການ payment methods, banks, accounts ແລະ settlement settings ຂອງ TJ POS Platform.": "ຈັດການວິທີຊຳລະ, ທະນາຄານ, ບັນຊີ ແລະ settlement settings ຂອງ TJ POS Platform.",
  "ກຳນົດ business information, owner account, plan, branches ແລະ modules.": "ກຳນົດຂໍ້ມູນທຸລະກິດ, ບັນຊີເຈົ້າຂອງ, ແພັກເກດ, ສາຂາ ແລະ module.",
  "ລາຍລະອຽດ business, owner, plan, modules ແລະ payment preference.": "ລາຍລະອຽດທຸລະກິດ, ເຈົ້າຂອງ, ແພັກເກດ, module ແລະ ຄ່າການຊຳລະ.",
  "Point of Sale (POS)": "ຂາຍໜ້າຮ້ານ (POS)",
  "Inventory Management": "ຈັດການສາງ",
  "Customer Management": "ຈັດການລູກຄ້າ",
  "Sales & Reporting": "ການຂາຍ & ລາຍງານ",
  "Advanced Reporting": "ລາຍງານຂັ້ນສູງ",
  "Loyalty Program": "ໂປຣແກຣມສະສົມແຕ້ມ",
  "Kitchen Display System": "Kitchen Display System",
  "Customer Display": "Customer Display",
  "Staff Order Mobile": "Staff Order Mobile",
  "Online Ordering": "ສັ່ງອອນລາຍ",
  "QR Public Menu": "QR Public Menu",
  "Core": "Core",
  "Add-on": "Add-on",
  "Display": "Display",
  "Kitchen": "Kitchen",
  "Public": "Public",
  "CRM": "CRM",
  "Total": "ລວມ",
  "Draft": "Draft",
  "Business -> Pro": "Business -> Pro",
  "Pro Plan": "ແພັກເກດ Pro",
  "Cafe": "ຮ້ານກາເຟ",
  "Laos": "ລາວ",
  "Vientiane Capital": "ນະຄອນຫຼວງວຽງຈັນ",
  "Savannakhet Province": "ແຂວງສະຫວັນນະເຂດ",
  "Luang Prabang Province": "ແຂວງຫຼວງພະບາງ",
  "Today": "ມື້ນີ້",
  "Yesterday": "ມື້ວານ",
  "Tomorrow": "ມື້ອື່ນ",
  "Now": "ຕອນນີ້",
  "Optional": "ບໍ່ບັງຄັບ",
  "May": "ພຶດສະພາ",
  "businesses": "ທຸລະກິດ"
};

export function toLaoText(value: string) {
  let translated = laoLabels[value] ?? value;

  translated = translated
    .replace(/\bMay\b/g, laoLabels.May)
    .replace(/\bToday\b/g, laoLabels.Today)
    .replace(/\bYesterday\b/g, laoLabels.Yesterday)
    .replace(/\bTomorrow\b/g, laoLabels.Tomorrow)
    .replace(/\bbusinesses\b/g, laoLabels.businesses);

  return translated;
}

export function toLaoNode(value: ReactNode): ReactNode {
  return typeof value === "string" ? toLaoText(value) : value;
}
