import type { AdminStatus } from "../types";

export function getStatusLabel(status: AdminStatus) {
  const labels: Record<AdminStatus, string> = {
    active: "ໃຊ້ງານ",
    trial: "ທົດລອງ",
    suspended: "ຖືກລະງັບ",
    pending: "ລໍຖ້າ",
    new: "ໃໝ່",
    inProgress: "ກຳລັງດຳເນີນການ",
    closed: "ປິດແລ້ວ",
    resolved: "ແກ້ໄຂແລ້ວ",
    inactive: "ບໍ່ໃຊ້ງານ"
  };

  return labels[status];
}

export function getStatusClass(status: AdminStatus) {
  const classes: Record<AdminStatus, string> = {
    active: "bg-emerald-50 text-emerald-700",
    trial: "bg-violet-50 text-violet-700",
    suspended: "bg-orange-50 text-orange-700",
    pending: "bg-amber-50 text-amber-700",
    new: "bg-blue-50 text-blue-700",
    inProgress: "bg-orange-50 text-orange-700",
    closed: "bg-slate-100 text-slate-600",
    resolved: "bg-emerald-50 text-emerald-700",
    inactive: "bg-red-50 text-red-700"
  };

  return classes[status];
}
