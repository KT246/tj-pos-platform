import {
  BadgeDollarSign,
  Barcode,
  BedDouble,
  Building2,
  CheckCircle2,
  ClipboardList,
  CloudOff,
  Coffee,
  ConciergeBell,
  CreditCard,
  HandCoins,
  Hotel,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  Scissors,
  ShoppingBasket,
  Sparkles,
  Utensils,
  Wallet
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { PosType } from "../types";

export type PosScreenTheme = {
  border: string;
  borderStrong: string;
  softBg: string;
  softerBg: string;
  activeBg: string;
  activeHoverBg: string;
  activeText: string;
  text: string;
  iconBox: string;
  focusRing: string;
  rowHover: string;
  shadow: string;
};

export type PosScreenConfig = {
  posType: PosType;
  icon: LucideIcon;
  ordersIcon: LucideIcon;
  checkoutIcon: LucideIcon;
  receiptIcon: LucideIcon;
  refundIcon: LucideIcon;
  shiftIcon: LucideIcon;
  offlineIcon: LucideIcon;
  theme: PosScreenTheme;
  topbar: {
    roleLabel: string;
    roleValue: string;
    shiftLabel: string;
    shiftContext: string;
    contextLabel: string;
    contextValue: string;
    statusLabel: string;
    statusValue: string;
  };
  orders: {
    openTitle: string;
    heldTitle: string;
    description: string;
    focusLabel: string;
    focusValue: string;
    workflowBadges: string[];
  };
  checkout: {
    title: string;
    description: string;
    focusLabel: string;
    focusValue: string;
    contextCards: { label: string; value: string }[];
  };
  receipt: {
    title: string;
    debtTitle: string;
    partialTitle: string;
    description: string;
    nextSteps: string[];
  };
  refund: {
    title: string;
    description: string;
    restockHint: string;
    approvalHint: string;
    ruleCards: { label: string; value: string }[];
  };
  shift: {
    openTitle: string;
    closeTitle: string;
    openDescription: string;
    closeDescription: string;
    focusLabel: string;
    focusValue: string;
    startStats: { label: string; value: string }[];
  };
  offline: {
    title: string;
    description: string;
    queueTitle: string;
    syncNote: string;
  };
};

const retailTheme: PosScreenTheme = {
  border: "border-blue-100",
  borderStrong: "border-blue-300",
  softBg: "bg-blue-50",
  softerBg: "bg-blue-50/40",
  activeBg: "bg-blue-600",
  activeHoverBg: "hover:bg-blue-700",
  activeText: "text-blue-600",
  text: "text-blue-700",
  iconBox: "bg-blue-50 text-blue-600",
  focusRing: "focus:border-blue-300 focus:ring-blue-50",
  rowHover: "hover:bg-blue-50/45",
  shadow: "shadow-[0_14px_30px_rgba(37,99,235,0.08)]"
};

const cafeTheme: PosScreenTheme = {
  border: "border-amber-100",
  borderStrong: "border-amber-300",
  softBg: "bg-amber-50",
  softerBg: "bg-amber-50/45",
  activeBg: "bg-amber-500",
  activeHoverBg: "hover:bg-amber-600",
  activeText: "text-amber-600",
  text: "text-amber-700",
  iconBox: "bg-amber-50 text-amber-600",
  focusRing: "focus:border-amber-300 focus:ring-amber-50",
  rowHover: "hover:bg-amber-50/45",
  shadow: "shadow-[0_14px_30px_rgba(245,158,11,0.08)]"
};

const restaurantTheme: PosScreenTheme = {
  border: "border-orange-100",
  borderStrong: "border-orange-300",
  softBg: "bg-orange-50",
  softerBg: "bg-orange-50/45",
  activeBg: "bg-orange-600",
  activeHoverBg: "hover:bg-orange-700",
  activeText: "text-orange-600",
  text: "text-orange-700",
  iconBox: "bg-orange-50 text-orange-600",
  focusRing: "focus:border-orange-300 focus:ring-orange-50",
  rowHover: "hover:bg-orange-50/45",
  shadow: "shadow-[0_14px_30px_rgba(234,88,12,0.08)]"
};

const beautyTheme: PosScreenTheme = {
  border: "border-fuchsia-100",
  borderStrong: "border-fuchsia-300",
  softBg: "bg-fuchsia-50",
  softerBg: "bg-fuchsia-50/45",
  activeBg: "bg-fuchsia-600",
  activeHoverBg: "hover:bg-fuchsia-700",
  activeText: "text-fuchsia-600",
  text: "text-fuchsia-700",
  iconBox: "bg-fuchsia-50 text-fuchsia-600",
  focusRing: "focus:border-fuchsia-300 focus:ring-fuchsia-50",
  rowHover: "hover:bg-fuchsia-50/45",
  shadow: "shadow-[0_14px_30px_rgba(192,38,211,0.08)]"
};

const hospitalityTheme: PosScreenTheme = {
  border: "border-emerald-100",
  borderStrong: "border-emerald-300",
  softBg: "bg-emerald-50",
  softerBg: "bg-emerald-50/45",
  activeBg: "bg-emerald-600",
  activeHoverBg: "hover:bg-emerald-700",
  activeText: "text-emerald-600",
  text: "text-emerald-700",
  iconBox: "bg-emerald-50 text-emerald-600",
  focusRing: "focus:border-emerald-300 focus:ring-emerald-50",
  rowHover: "hover:bg-emerald-50/45",
  shadow: "shadow-[0_14px_30px_rgba(5,150,105,0.08)]"
};

export const posScreenConfigByType: Record<PosType, PosScreenConfig> = {
  retail: {
    posType: "retail",
    icon: ShoppingBasket,
    ordersIcon: ClipboardList,
    checkoutIcon: Barcode,
    receiptIcon: ReceiptText,
    refundIcon: RotateCcw,
    shiftIcon: Wallet,
    offlineIcon: CloudOff,
    theme: retailTheme,
    topbar: {
      roleLabel: "ແຄັດເຊຍ",
      roleValue: "ແຄັດເຊຍເຄົາເຕີ",
      shiftLabel: "ກະຂາຍປີກ",
      shiftContext: "ເຄົາເຕີ Barcode",
      contextLabel: "ໂໝດຂາຍປີກ",
      contextValue: "ຂາຍຕັດສະຕັອກ",
      statusLabel: "Sync ສະຕັອກ",
      statusValue: "ອອນລາຍ"
    },
    orders: {
      openTitle: "ຄິວການຂາຍປີກ",
      heldTitle: "ການຂາຍປີກທີ່ພັກໄວ້",
      description:
        "ການຂາຍໜ້າຮ້ານ, ລູກຄ້າຂາຍສົ່ງ, ການຄືນສິນຄ້າ ແລະ ລາຍການທີ່ກະທົບຄັງ.",
      focusLabel: "ໂຟກັສຂາຍປີກ",
      focusValue: "ສິນຄ້າ, Barcode, ລາຄາລູກຄ້າ ແລະ ຕັດສະຕັອກ",
      workflowBadges: ["ຂາຍດ້ວຍ Barcode", "ລາຄາຂາຍສົ່ງ", "ຕັດສະຕັອກ"]
    },
    checkout: {
      title: "ເຄົາເຕີຊຳລະຂາຍປີກ",
      description:
        "ຢືນຢັນເງິນສົດ, Bank QR, ໜີ້ ແລະ ການຕັດສະຕັອກກ່ອນປິດການຂາຍ.",
      focusLabel: "ຂັ້ນຕອນຊຳລະ",
      focusValue: "ລາຄາຂາຍປີກ, ລາຄາຂາຍສົ່ງ, ໜີ້ລູກຄ້າ",
      contextCards: [
        { label: "ກົດລາຄາ", value: "ຂາຍປີກ / ຂາຍສົ່ງ / ຜູ້ຂາຍຕໍ່" },
        { label: "ກົດສະຕັອກ", value: "ຕັດສະຕັອກຫຼັງຊຳລະແລ້ວ" },
        { label: "ກົດໜີ້", value: "ຕ້ອງມີວົງເງິນເຄຣດິດລູກຄ້າ" }
      ]
    },
    receipt: {
      title: "ໃບບິນຂາຍປີກພ້ອມແລ້ວ",
      debtTitle: "ບັນທຶກໜີ້ຂາຍປີກແລ້ວ",
      partialTitle: "ບັນທຶກຈ່າຍບາງສ່ວນຂາຍປີກແລ້ວ",
      description: "ພິມໃບບິນຂາຍ ຫຼື ເລີ່ມຂາຍໜ້າຮ້ານໃໝ່.",
      nextSteps: ["ພິມໃບບິນໃຫ້ລູກຄ້າ", "ອັບເດດການເຄື່ອນໄຫວສະຕັອກ", "ເລີ່ມຂາຍ Barcode ລາຍການຕໍ່ໄປ"]
    },
    refund: {
      title: "ເຄົາເຕີຄືນສິນຄ້າຂາຍປີກ",
      description:
        "ຄົ້ນຫາໃບບິນ, ເລືອກສິນຄ້າຄືນ, ກຳນົດການເຂົ້າສະຕັອກ ແລະ ຕ້ອງອະນຸມັດ.",
      restockHint: "ສິນຄ້າທີ່ຄືນສາມາດເຂົ້າສະຕັອກໄດ້ເມື່ອເລືອກ restock.",
      approvalHint: "ການຄືນສິນຄ້າຂາຍປີກຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ.",
      ruleCards: [
        { label: "ຂອບເຂດການຄືນ", value: "ຄືນເປັນລາຍການ ຫຼື ທັງໃບບິນ" },
        { label: "ຜົນກະທົບສະຕັອກ", value: "Restock ສາມາດເພີ່ມສິນຄ້າກັບຄືນ" },
        { label: "ກົດການກວດສອບ", value: "ເຫດຜົນ ແລະ ການອະນຸມັດຈາກຜູ້ຈັດການ" }
      ]
    },
    shift: {
      openTitle: "ເປີດລິ້ນຊັກຂາຍປີກ",
      closeTitle: "ປິດລິ້ນຊັກຂາຍປີກ",
      openDescription: "ນັບເງິນຕົ້ນກະກ່ອນຂາຍດ້ວຍ Barcode ແລະ ຕັດສະຕັອກ.",
      closeDescription:
        "ກວດເງິນສົດ, ໂອນທະນາຄານ, QR, ໜີ້, ການຄືນ ແລະ ສ່ວນຕ່າງລິ້ນຊັກ.",
      focusLabel: "ໂຟກັສລິ້ນຊັກ",
      focusValue: "ເງິນສົດ, Bank QR, ການຄືນ ແລະ ຂາຍຕັດສະຕັອກ",
      startStats: [
        { label: "ລິ້ນຊັກເງິນ", value: "ພ້ອມ" },
        { label: "ເຄື່ອງສະແກນ Barcode", value: "ພ້ອມ" },
        { label: "Sync ສະຕັອກ", value: "ອອນລາຍ" }
      ]
    },
    offline: {
      title: "ການຂາຍປີກອອບລາຍ",
      description: "ການຂາຍຈະຢູ່ໃນເຄື່ອງ ແລະ sync ສະຕັອກຕໍ່ເມື່ອອອນລາຍ.",
      queueTitle: "ຄິວຂາຍປີກອອບລາຍ",
      syncNote: "ການເຄື່ອນໄຫວສະຕັອກຈະ sync ຫຼັງຈາກການເຊື່ອມຕໍ່ກັບມາ."
    }
  },
  cafe: {
    posType: "cafe",
    icon: Coffee,
    ordersIcon: ClipboardList,
    checkoutIcon: Coffee,
    receiptIcon: ReceiptText,
    refundIcon: RotateCcw,
    shiftIcon: Wallet,
    offlineIcon: CloudOff,
    theme: cafeTheme,
    topbar: {
      roleLabel: "ບາຣິສຕ້າ",
      roleValue: "ເຄົາເຕີເຄື່ອງດື່ມ",
      shiftLabel: "ກະຮ້ານກາເຟ",
      shiftContext: "ຄິວຮັບເຄື່ອງ",
      contextLabel: "ໂໝດຮ້ານກາເຟ",
      contextValue: "ເມນູ ແລະ ຮັບເຄື່ອງ",
      statusLabel: "Sync Barista",
      statusValue: "ອອນລາຍ"
    },
    orders: {
      openTitle: "ຄິວອໍເດີກາເຟ",
      heldTitle: "ອໍເດີກາເຟທີ່ພັກໄວ້",
      description:
        "ຕິດຕາມຮັບເຄື່ອງດື່ມ, ໂຕະ, ຕົວເລືອກ, ສົ່ງໃຫ້ Barista ແລະ ບິນສັ່ງກັບບ້ານ.",
      focusLabel: "ໂຟກັສກາເຟ",
      focusValue: "ເຄື່ອງດື່ມ, ຕົວເລືອກ, ຮັບສິນຄ້າ, ສົ່ງໃຫ້ Barista",
      workflowBadges: ["ບິນຮັບເຄື່ອງ", "ຕົວເລືອກເຄື່ອງດື່ມ", "ສົ່ງຕໍ່ໃຫ້ Barista"]
    },
    checkout: {
      title: "ຊຳລະອໍເດີກາເຟ",
      description: "ຊຳລະອໍເດີເຄື່ອງດື່ມ ແລະ ຮັກສາຂັ້ນຕອນຮັບເຄື່ອງໃຫ້ຊັດເຈນ.",
      focusLabel: "ຂັ້ນຕອນຊຳລະ",
      focusValue: "ຕົວເລືອກເຄື່ອງດື່ມ, ເລກຮັບເຄື່ອງ, ໜີ້ລູກຄ້າ",
      contextCards: [
        { label: "ກົດຮັບເຄື່ອງ", value: "ໃບບິນຈະຍ້າຍໄປຄິວຮັບເຄື່ອງ" },
        { label: "ກົດຕົວເລືອກ", value: "ນ້ຳຕານ, ນ້ຳກ້ອນ ແລະ topping ຈະຢູ່ໃນບິນ" },
        { label: "ລາຍການທີ່ກຽມແລ້ວ", value: "ຄືນເງິນເຄື່ອງດື່ມບໍ່ເຂົ້າສະຕັອກ" }
      ]
    },
    receipt: {
      title: "ໃບບິນກາເຟພ້ອມແລ້ວ",
      debtTitle: "ບັນທຶກໜີ້ກາເຟແລ້ວ",
      partialTitle: "ບັນທຶກຈ່າຍບາງສ່ວນກາເຟແລ້ວ",
      description: "ພິມໃບບິນ ແລະ ຍ້າຍບິນໄປຈຸດຮັບເຄື່ອງ.",
      nextSteps: ["ພິມບິນຮັບເຄື່ອງ", "ສົ່ງໃຫ້ Barista", "ເອີ້ນເລກຮັບເຄື່ອງ"]
    },
    refund: {
      title: "ເຄົາເຕີຄືນເງິນກາເຟ",
      description:
        "ຄົ້ນຫາໃບບິນ, ເລືອກເຄື່ອງດື່ມ ຫຼື ເບເກີຣີ, ບັນທຶກເຫດຜົນ ແລະ ອະນຸມັດຄືນເງິນ.",
      restockHint: "ສິນຄ້າທີ່ເປັນແພັກສາມາດເຂົ້າສະຕັອກ; ເຄື່ອງດື່ມທີ່ກຽມແລ້ວບໍ່ຄວນເຂົ້າສະຕັອກ.",
      approvalHint: "ການຄືນເງິນກາເຟຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ.",
      ruleCards: [
        { label: "ກົດເຄື່ອງດື່ມ", value: "ເຄື່ອງດື່ມທີ່ກຽມແລ້ວບໍ່ເຂົ້າສະຕັອກ" },
        { label: "ກົດເບເກີຣີ", value: "ເບເກີຣີແບບແພັກສາມາດເຂົ້າສະຕັອກ" },
        { label: "ກົດຮັບເຄື່ອງ", value: "ຍົກເລີກບິນຮັບເຄື່ອງຖ້າຄືນເງິນ" }
      ]
    },
    shift: {
      openTitle: "ເປີດກະກາເຟ",
      closeTitle: "ປິດກະກາເຟ",
      openDescription: "ນັບເງິນຕົ້ນກະກ່ອນເລີ່ມອໍເດີ Barista.",
      closeDescription:
        "ກວດເງິນສົດ, ໂອນທະນາຄານ, QR, ອໍເດີຮັບເຄື່ອງ ແລະ ສ່ວນຕ່າງລິ້ນຊັກ.",
      focusLabel: "ໂຟກັສກະ",
      focusValue: "ອໍເດີຮັບເຄື່ອງ, ສົ່ງໃຫ້ Barista ແລະ ເງິນສົດປະຈຳວັນ",
      startStats: [
        { label: "ລິ້ນຊັກເງິນ", value: "ພ້ອມ" },
        { label: "ຄິວ Barista", value: "ພ້ອມ" },
        { label: "ເຄື່ອງພິມ", value: "ອອນລາຍ" }
      ]
    },
    offline: {
      title: "ອໍເດີກາເຟອອບລາຍ",
      description: "ບິນກາເຟຈະຢູ່ໃນເຄື່ອງ ແລະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
      queueTitle: "ຄິວກາເຟອອບລາຍ",
      syncNote: "ບິນຮັບເຄື່ອງ ແລະ ຄິວ Barista ຈະ sync ເມື່ອອອນລາຍ."
    }
  },
  restaurant: {
    posType: "restaurant",
    icon: Utensils,
    ordersIcon: ConciergeBell,
    checkoutIcon: CreditCard,
    receiptIcon: ReceiptText,
    refundIcon: RotateCcw,
    shiftIcon: Wallet,
    offlineIcon: CloudOff,
    theme: restaurantTheme,
    topbar: {
      roleLabel: "ພະນັກງານພື້ນທີ່",
      roleValue: "ບໍລິການຕາມໂຕະ",
      shiftLabel: "ກະພື້ນທີ່ອາຫານ",
      shiftContext: "ເຊື່ອມຄົວແລ້ວ",
      contextLabel: "ໂໝດຮ້ານອາຫານ",
      contextValue: "ໂຕະ ແລະ ບິນ",
      statusLabel: "Sync ຄົວ",
      statusValue: "ອອນລາຍ"
    },
    orders: {
      openTitle: "ອໍເດີໂຕະຮ້ານອາຫານ",
      heldTitle: "ອໍເດີໂຕະທີ່ພັກໄວ້",
      description:
        "ຕິດຕາມໂຕະນັ່ງກິນ, ລຳດັບເຂົ້າຄົວ, ແບ່ງບິນ ແລະ ຄ່າບໍລິການ.",
      focusLabel: "ໂຟກັສຮ້ານອາຫານ",
      focusValue: "ໂຕະ, ຄົວ, ລຳດັບອາຫານ, ແບ່ງບິນ",
      workflowBadges: ["ບິນໂຕະ", "ລຳດັບເຂົ້າຄົວ", "ແບ່ງບິນ"]
    },
    checkout: {
      title: "ຊຳລະບິນຮ້ານອາຫານ",
      description:
        "ປິດບິນໂຕະດ້ວຍເງິນສົດ, Bank QR, ແບ່ງບິນ, ຄ່າບໍລິການ ຫຼື ໜີ້.",
      focusLabel: "ຂັ້ນຕອນຊຳລະ",
      focusValue: "ບິນໂຕະ, ຄ່າບໍລິການ, ສະຖານະຄົວ",
      contextCards: [
        { label: "ກົດໂຕະ", value: "ປິດບິນໂຕະຫຼັງຈາກຊຳລະ" },
        { label: "ກົດຄົວ", value: "ລາຍການຄົວຕ້ອງຖືກສົ່ງເຂົ້າຄົວ" },
        { label: "ກົດບິນ", value: "ຮອງຮັບແບ່ງບິນ ແລະ ຄ່າບໍລິການ" }
      ]
    },
    receipt: {
      title: "ບິນຮ້ານອາຫານພ້ອມແລ້ວ",
      debtTitle: "ບັນທຶກໜີ້ຮ້ານອາຫານແລ້ວ",
      partialTitle: "ບັນທຶກຈ່າຍບາງສ່ວນຮ້ານອາຫານແລ້ວ",
      description: "ພິມບິນໂຕະ ຫຼື ກັບໄປແຜນຜັງໂຕະ.",
      nextSteps: ["ພິມບິນໂຕະ", "ລ້າງສະຖານະໂຕະ", "ກັບໄປແຜນຜັງພື້ນທີ່"]
    },
    refund: {
      title: "ຂັ້ນຕອນຄືນເງິນຮ້ານອາຫານ",
      description:
        "ຄົ້ນຫາບິນໂຕະ, ເລືອກລາຍການ, ບັນທຶກເຫດຜົນ ແລະ ອະນຸມັດຄືນເງິນ.",
      restockHint: "ອາຫານທີ່ກຽມແລ້ວບໍ່ເຂົ້າສະຕັອກ; ສິນຄ້າແພັກສາມາດເຂົ້າສະຕັອກ.",
      approvalHint: "ການຄືນເງິນຮ້ານອາຫານຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ.",
      ruleCards: [
        { label: "ບິນໂຕະ", value: "ຄືນເງິນຕາມບິນໂຕະ ຫຼື ລາຍການທີ່ເລືອກ" },
        { label: "ກົດຄົວ", value: "ອາຫານທີ່ກຽມແລ້ວບໍ່ເຂົ້າສະຕັອກ" },
        { label: "ກົດການກວດສອບ", value: "ເຫດຜົນ ແລະ ການອະນຸມັດຈາກຜູ້ຈັດການ" }
      ]
    },
    shift: {
      openTitle: "ເປີດກະຮ້ານອາຫານ",
      closeTitle: "ປິດກະຮ້ານອາຫານ",
      openDescription: "ນັບເງິນຕົ້ນກະກ່ອນເລີ່ມບໍລິການໂຕະ.",
      closeDescription:
        "ກວດບິນໂຕະ, ເງິນສົດ, ໂອນທະນາຄານ, QR ແລະ ສ່ວນຕ່າງລິ້ນຊັກ.",
      focusLabel: "ໂຟກັສກະ",
      focusValue: "ໂຕະ, ຄ່າບໍລິການ, ບິນຄົວ",
      startStats: [
        { label: "ລິ້ນຊັກເງິນ", value: "ພ້ອມ" },
        { label: "ຈໍຄົວ", value: "ອອນລາຍ" },
        { label: "ແຜນຜັງໂຕະ", value: "ພ້ອມ" }
      ]
    },
    offline: {
      title: "ອໍເດີຮ້ານອາຫານອອບລາຍ",
      description: "ອໍເດີໂຕະຈະຢູ່ໃນເຄື່ອງ ແລະ sync ເມື່ອເຄືອຂ່າຍກັບມາ.",
      queueTitle: "ຄິວຮ້ານອາຫານອອບລາຍ",
      syncNote: "ບິນໂຕະ ແລະ ບິນຄົວຈະ sync ເມື່ອອອນລາຍ."
    }
  },
  beauty: {
    posType: "beauty",
    icon: Sparkles,
    ordersIcon: Scissors,
    checkoutIcon: BadgeDollarSign,
    receiptIcon: ReceiptText,
    refundIcon: RotateCcw,
    shiftIcon: Wallet,
    offlineIcon: CloudOff,
    theme: beautyTheme,
    topbar: {
      roleLabel: "ພະນັກງານບໍລິການ",
      roleValue: "ເຄົາເຕີນັດໝາຍ",
      shiftLabel: "ກະຄວາມງາມ",
      shiftContext: "ຈອງບໍລິການ",
      contextLabel: "ໂໝດຄວາມງາມ",
      contextValue: "ນັດໝາຍ ແລະ ແພັກເກດ",
      statusLabel: "Sync ການຈອງ",
      statusValue: "ອອນລາຍ"
    },
    orders: {
      openTitle: "ຄິວບໍລິການຄວາມງາມ",
      heldTitle: "ບໍລິການຄວາມງາມທີ່ພັກໄວ້",
      description:
        "ຕິດຕາມນັດໝາຍ, ພະນັກງານ, ແພັກເກດ, ເວລາ ແລະ ມັດຈຳ.",
      focusLabel: "ໂຟກັສຄວາມງາມ",
      focusValue: "ນັດໝາຍ, ແພັກເກດ, ພະນັກງານ, ຄ່າຄອມ",
      workflowBadges: ["ນັດໝາຍ", "ແພັກເກດບໍລິການ", "ຄ່າຄອມພະນັກງານ"]
    },
    checkout: {
      title: "ຊຳລະບໍລິການຄວາມງາມ",
      description:
        "ປິດຮອບບໍລິການພ້ອມແພັກເກດ, ມັດຈຳ, ພະນັກງານ ແລະ ໜີ້.",
      focusLabel: "ຂັ້ນຕອນຊຳລະ",
      focusValue: "ແພັກເກດບໍລິການ, ມັດຈຳ, ຄ່າຄອມ, ໜີ້ລູກຄ້າ",
      contextCards: [
        { label: "ກົດນັດໝາຍ", value: "ອັບເດດການຈອງຫຼັງຊຳລະ" },
        { label: "ກົດແພັກເກດ", value: "ຫັກຍອດຄັ້ງໃນແພັກເກດ" },
        { label: "ກົດພະນັກງານ", value: "ຕິດຕາມຄ່າຄອມບໍລິການ" }
      ]
    },
    receipt: {
      title: "ໃບບິນບໍລິການຄວາມງາມພ້ອມແລ້ວ",
      debtTitle: "ບັນທຶກໜີ້ຄວາມງາມແລ້ວ",
      partialTitle: "ບັນທຶກຈ່າຍບາງສ່ວນຄວາມງາມແລ້ວ",
      description: "ພິມໃບບິນບໍລິການ ແລະ ອັບເດດນັດໝາຍ.",
      nextSteps: ["ພິມໃບບິນບໍລິການ", "ອັບເດດສະຖານະນັດໝາຍ", "ບັນທຶກຄ່າຄອມພະນັກງານ"]
    },
    refund: {
      title: "ຂັ້ນຕອນຄືນເງິນຄວາມງາມ",
      description:
        "ຄົ້ນຫາໃບບິນ, ເລືອກບໍລິການ/ແພັກເກດ, ບັນທຶກເຫດຜົນ ແລະ ອະນຸມັດຄືນເງິນ.",
      restockHint: "ການຄືນເງິນບໍລິການບໍ່ເຂົ້າສະຕັອກ; ແພັກເກດຈະອັບເດດຍອດຄົງເຫຼືອ.",
      approvalHint: "ການຄືນເງິນຄວາມງາມຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ.",
      ruleCards: [
        { label: "ກົດບໍລິການ", value: "ຄືນເງິນບໍລິການບໍ່ເຂົ້າສະຕັອກ" },
        { label: "ກົດແພັກເກດ", value: "ຍອດຄັ້ງໃນແພັກເກດສາມາດອັບເດດ" },
        { label: "ກົດພະນັກງານ", value: "ຕ້ອງປັບຄ່າຄອມ" }
      ]
    },
    shift: {
      openTitle: "ເປີດກະຄວາມງາມ",
      closeTitle: "ປິດກະຄວາມງາມ",
      openDescription: "ນັບເງິນຕົ້ນກະກ່ອນນັດໝາຍ ແລະ ຊຳລະບໍລິການ.",
      closeDescription:
        "ກວດລາຍຮັບບໍລິການ, ມັດຈຳ, Bank QR, ຄ່າຄອມພະນັກງານ ແລະ ເງິນສົດ.",
      focusLabel: "ໂຟກັສກະ",
      focusValue: "ນັດໝາຍ, ຂາຍແພັກເກດ, ຄ່າຄອມພະນັກງານ",
      startStats: [
        { label: "ລິ້ນຊັກເງິນ", value: "ພ້ອມ" },
        { label: "ສົມຸດນັດໝາຍ", value: "ພ້ອມ" },
        { label: "ລາຍຊື່ພະນັກງານ", value: "ພ້ອມ" }
      ]
    },
    offline: {
      title: "ບໍລິການຄວາມງາມອອບລາຍ",
      description: "ການຊຳລະບໍລິການຈະຢູ່ໃນເຄື່ອງ ແລະ sync ເມື່ອອອນລາຍ.",
      queueTitle: "ຄິວຄວາມງາມອອບລາຍ",
      syncNote: "ນັດໝາຍ ແລະ ຍອດແພັກເກດຈະ sync ເມື່ອອອນລາຍ."
    }
  },
  hospitality: {
    posType: "hospitality",
    icon: Hotel,
    ordersIcon: BedDouble,
    checkoutIcon: Building2,
    receiptIcon: ReceiptText,
    refundIcon: RotateCcw,
    shiftIcon: Wallet,
    offlineIcon: CloudOff,
    theme: hospitalityTheme,
    topbar: {
      roleLabel: "ໜ້າເຄົາເຕີ",
      roleValue: "ບໍລິການແຂກ",
      shiftLabel: "ກະໜ້າເຄົາເຕີ",
      shiftContext: "ບັນຊີຫ້ອງ",
      contextLabel: "ໂໝດໂຮງແຮມ",
      contextValue: "ຫ້ອງ ແລະ ມັດຈຳ",
      statusLabel: "Sync ບັນຊີແຂກ",
      statusValue: "ອອນລາຍ"
    },
    orders: {
      openTitle: "ຄິວບັນຊີແຂກໂຮງແຮມ",
      heldTitle: "ບັນຊີແຂກທີ່ພັກໄວ້",
      description:
        "ຕິດຕາມຫ້ອງ, ການຈອງ, ເຂົ້າ/ອອກພັກ, ມັດຈຳ ແລະ ຄ່າເພີ່ມ.",
      focusLabel: "ໂຟກັສທີ່ພັກ",
      focusValue: "ຫ້ອງ, ການຈອງ, ມັດຈຳ, ບັນຊີແຂກ",
      workflowBadges: ["ບັນຊີຫ້ອງ", "ມັດຈຳ", "ຄ່າໃຊ້ຈ່າຍເພີ່ມ"]
    },
    checkout: {
      title: "ຊຳລະບັນຊີແຂກໂຮງແຮມ",
      description:
        "ປິດບັນຊີຫ້ອງພ້ອມມັດຈຳ, ຄ່າເພີ່ມ, Bank QR ຫຼື ໜີ້ແຂກ.",
      focusLabel: "ຂັ້ນຕອນຊຳລະ",
      focusValue: "ຄ່າຫ້ອງ, ມັດຈຳ, ບໍລິການເພີ່ມ, ໜີ້ແຂກ",
      contextCards: [
        { label: "ກົດຫ້ອງ", value: "ອັບເດດສະຖານະຫ້ອງຫຼັງຊຳລະ" },
        { label: "ກົດມັດຈຳ", value: "ນຳມັດຈຳໄປຫັກກ່ອນຍອດສຸດທ້າຍ" },
        { label: "ກົດບັນຊີແຂກ", value: "ຫ້ອງ ແລະ ຄ່າເພີ່ມໃຊ້ບັນຊີແຂກດຽວກັນ" }
      ]
    },
    receipt: {
      title: "ໃບບິນບັນຊີແຂກພ້ອມແລ້ວ",
      debtTitle: "ບັນທຶກໜີ້ແຂກໂຮງແຮມແລ້ວ",
      partialTitle: "ບັນທຶກຈ່າຍບາງສ່ວນໂຮງແຮມແລ້ວ",
      description: "ພິມໃບບິນບັນຊີແຂກ ແລະ ອັບເດດສະຖານະຫ້ອງ.",
      nextSteps: ["ພິມບັນຊີແຂກ", "ອັບເດດສະຖານະຫ້ອງ", "ປິດຍອດມັດຈຳ"]
    },
    refund: {
      title: "ຄືນເງິນບັນຊີແຂກໂຮງແຮມ",
      description:
        "ຄົ້ນຫາບັນຊີແຂກ, ເລືອກຫ້ອງ ຫຼື ຄ່າເພີ່ມ, ບັນທຶກເຫດຜົນ ແລະ ອະນຸມັດຄືນເງິນ.",
      restockHint: "ຄ່າຫ້ອງບໍ່ເຂົ້າສະຕັອກ; ບໍລິການເພີ່ມສາມາດອັບເດດສະຕັອກຖ້າມີການຕິດຕາມ.",
      approvalHint: "ການຄືນເງິນບັນຊີແຂກໂຮງແຮມຕ້ອງໃຫ້ຜູ້ຈັດການອະນຸມັດ.",
      ruleCards: [
        { label: "ກົດຫ້ອງ", value: "ຄືນເງິນຄ່າຫ້ອງບໍ່ເຂົ້າສະຕັອກ" },
        { label: "ກົດມັດຈຳ", value: "ຄືນມັດຈຳຕ້ອງອະນຸມັດ" },
        { label: "ກົດບັນຊີແຂກ", value: "ສະຕັອກບໍລິການເພີ່ມຈະອັບເດດສະເພາະຖ້າມີການຕິດຕາມ" }
      ]
    },
    shift: {
      openTitle: "ເປີດກະໜ້າເຄົາເຕີ",
      closeTitle: "ປິດກະໜ້າເຄົາເຕີ",
      openDescription:
        "ນັບເງິນຕົ້ນກະກ່ອນເຂົ້າພັກ, ຮັບມັດຈຳ ແລະ ຊຳລະບັນຊີແຂກ.",
      closeDescription:
        "ກວດລາຍຮັບຫ້ອງ, ມັດຈຳ, ຄ່າເພີ່ມ, Bank QR ແລະ ສ່ວນຕ່າງລິ້ນຊັກ.",
      focusLabel: "ໂຟກັສກະ",
      focusValue: "ຫ້ອງ, ມັດຈຳ, ຄ່າເພີ່ມ, ອອກພັກ",
      startStats: [
        { label: "ລິ້ນຊັກເງິນ", value: "ພ້ອມ" },
        { label: "ກະດານຫ້ອງ", value: "ພ້ອມ" },
        { label: "Sync ບັນຊີແຂກ", value: "ອອນລາຍ" }
      ]
    },
    offline: {
      title: "ບັນຊີແຂກໂຮງແຮມອອບລາຍ",
      description: "ການອັບເດດບັນຊີຫ້ອງຈະຢູ່ໃນເຄື່ອງ ແລະ sync ເມື່ອອອນລາຍ.",
      queueTitle: "ຄິວໂຮງແຮມອອບລາຍ",
      syncNote: "ສະຖານະຫ້ອງ, ມັດຈຳ ແລະ ບັນຊີແຂກຈະ sync ເມື່ອອອນລາຍ."
    }
  }
};

export function getPosScreenConfig(posType: PosType) {
  return posScreenConfigByType[posType];
}
