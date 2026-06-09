import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type BusinessMenuKey =
  | "ແດຊບອດ"
  | "POS"
  | "ອໍເດີ"
  | "ນັດໝາຍ"
  | "ປະຕິທິນ"
  | "ການຈອງ"
  | "ລູກຄ້າ Walk-in"
  | "ສິນຄ້າ"
  | "ບໍລິການ"
  | "ໝວດໝູ່"
  | "ແຜນຜັງໂຕະ"
  | "ຕົວເລືອກເພີ່ມ"
  | "ຄິວ Barista"
  | "ຈໍຮັບອໍເດີ"
  | "Happy Hour"
  | "ພາບລວມຮ້ານກາເຟ"
  | "ການຈອງໂຕະ"
  | "ລຳດັບຄົວ"
  | "ແຍກບິນ"
  | "ຄ່າບໍລິການ"
  | "ລວມ / ຍ້າຍ"
  | "ປິດຮອບມື້"
  | "ຕາຕະລາງພະນັກງານ"
  | "ແພັກເກດ"
  | "ນະໂຍບາຍມັດຈຳ"
  | "ພາບລວມຮ້ານຄວາມງາມ"
  | "ຫ້ອງ"
  | "ປະຕິທິນຫ້ອງ"
  | "ຟຣອນດ໌ເດສກ໌"
  | "Check-in"
  | "Check-out"
  | "ແຂກ"
  | "ຕັ້ງຄ່າຫ້ອງ"
  | "ແມ່ບ້ານ"
  | "ບັນຊີແຂກ"
  | "ສະຕັອກ"
  | "ການເຄື່ອນໄຫວສະຕັອກ"
  | "ນັບສະຕັອກ"
  | "ຮັບສິນຄ້າ"
  | "ຄືນສິນຄ້າ"
  | "ສະຕັອກຕ່ຳ / ໃກ້ໝົດອາຍຸ"
  | "ປ້າຍ Barcode"
  | "ຜູ້ສະໜອງ"
  | "ລູກຄ້າ"
  | "ສະສົມແຕ້ມ"
  | "ໂປຣໂມຊັນ"
  | "ພະນັກງານ"
  | "ບົດບາດ ແລະ ສິດ"
  | "ສາຂາ"
  | "ລາຍງານ"
  | "ໃບຮັບເງິນ / ບິນ"
  | "ແບຣນດ໌"
  | "ວິທີຊຳລະ"
  | "ອຸປະກອນ"
  | "ໂມດູນ"
  | "ນຳເຂົ້າ / ສົ່ງອອກ"
  | "ຊ່ວຍເຫຼືອ"
  | "ບັນທຶກກວດສອບ"
  | "ຕັ້ງຄ່າ";

export type Tone = "blue" | "emerald" | "amber" | "red" | "violet" | "cyan" | "slate";

export type Kpi = {
  label: string;
  value: string;
  change?: string;
  tone: Tone;
  icon: LucideIcon;
};

export type TableColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render: (row: T, index: number) => ReactNode;
};

export type SummaryItem = {
  label: string;
  value: string;
  tone?: Tone;
};

export type QuickAction = {
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  tone: Tone;
};
