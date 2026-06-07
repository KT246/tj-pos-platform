import { ClipboardList, Table2, UserCircle, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { getStaffOrderPath } from "../utils";
import { lo } from "../utils/lao-labels";

const navItems = [
  { id: "tables", label: "Tables", icon: Table2, path: "/tables" },
  { id: "menu", label: "Menu", icon: ClipboardCheck, path: "/table/T03" },
  { id: "orders", label: "Orders", icon: ClipboardList, path: "/orders" },
  { id: "profile", label: "Profile", icon: UserCircle, path: "/profile" }
];

export function StaffBottomNav({
  businessSlug,
  active,
  selectedTableId
}: {
  businessSlug: string;
  active: "tables" | "menu" | "orders" | "profile";
  selectedTableId: string;
}) {
  return (
    <nav className="grid h-[76px] grid-cols-4 px-3 pt-2 pb-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        const path = item.id === "menu" ? `/table/${selectedTableId}` : item.path;

        return (
          <Link
            key={item.id}
            to={getStaffOrderPath(businessSlug, path)}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition ${
              isActive
                ? "text-blue-600"
                : "text-slate-500 hover:bg-blue-50/50 hover:text-blue-600"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                  : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            {item.id === "orders" ? (
              <span className="absolute top-2 right-[34%] h-2.5 w-2.5 rounded-full bg-red-500" />
            ) : null}
            {lo(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
