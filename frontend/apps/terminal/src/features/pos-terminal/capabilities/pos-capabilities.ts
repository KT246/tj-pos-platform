import type { TerminalBusinessProfile, TerminalCapabilities } from "../types";

const capabilityLabels: Record<keyof TerminalCapabilities, string> = {
  hasBarcode: "Barcode",
  hasInventory: "ຄັງສິນຄ້າ",
  hasTables: "ໂຕະ",
  hasModifiers: "ຕົວເລືອກ",
  hasKitchen: "ຄົວ",
  hasAppointments: "ນັດໝາຍ",
  hasRooms: "ຫ້ອງ",
  hasCheckIn: "ເຂົ້າພັກ",
  hasSplitBill: "ແບ່ງບິນ",
  hasServiceCharge: "ຄ່າບໍລິການ",
  hasWholesale: "ຂາຍສົ່ງ",
  hasDebt: "ຕິດໜີ້"
};

export function getEnabledCapabilityLabels(profile: TerminalBusinessProfile) {
  return (Object.keys(profile.capabilities) as Array<keyof TerminalCapabilities>)
    .filter((key) => profile.capabilities[key])
    .map((key) => capabilityLabels[key]);
}
