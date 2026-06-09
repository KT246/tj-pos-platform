import type { Category } from "../types";

export function CategoryRail({
  categories,
  activeCategory,
  onSelect
}: {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <aside className="h-full overflow-y-auto rounded-lg border border-blue-100 bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.035)] [scrollbar-width:thin]">
      <div className="space-y-1">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`flex h-9 w-full items-center rounded-md px-2.5 text-left text-[12px] font-extrabold transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                  : "text-slate-700 hover:bg-blue-50/70 hover:text-blue-600"
              }`}
            >
              <span className="truncate">{category.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
