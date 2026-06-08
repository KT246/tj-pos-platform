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
    <nav className="grid h-[62px] grid-cols-4 px-2 pt-1.5 pb-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        const path = item.id === "menu" ? `/table/${selectedTableId}` : item.path;

        return (
          <Link
            key={item.id}
            to={getStaffOrderPath(businessSlug, path)}
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-bold transition ${
              isActive
                ? "text-blue-600"
                : "text-slate-500 hover:text-blue-600"
            }`}
          >
            {isActive ? (
              <span className="absolute top-0 h-0.5 w-5 rounded-full bg-blue-600" />
            ) : null}
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-500 hover:bg-blue-50/50"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            {item.id === "orders" ? (
              <span className="absolute top-2 right-[34%] h-2 w-2 rounded-full bg-red-500" />
            ) : null}
            {lo(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
