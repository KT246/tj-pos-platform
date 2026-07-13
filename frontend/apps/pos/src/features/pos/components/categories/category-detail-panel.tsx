import type { CafeCategory } from "@/features/pos/data/cafe-categories"
import { cn } from "@/lib/utils"

type CategoryDetailPanelProps = {
  category: CafeCategory
  mode: "create" | "edit"
  saving?: boolean
  onChange: (category: Partial<CafeCategory>) => void
  onCancel: () => void
  onSave: () => void
  onDelete?: () => void
}

export function CategoryDetailPanel({
  category,
  mode,
  saving = false,
  onChange,
  onCancel,
  onSave,
  onDelete,
}: CategoryDetailPanelProps) {
  return (
    <aside className="flex h-full min-h-0 w-[360px] shrink-0 flex-col overflow-hidden border-l border-[#ded4c8] bg-white">
      <div className="flex h-[58px] shrink-0 items-center border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
        <div>
          <h2 className="text-base font-bold text-[#2f2419]">
            {mode === "create" ? "ເພີ່ມໝວດໝູ່" : "ຂໍ້ມູນໝວດໝູ່"}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-[#6f5c49]">
            {mode === "create" ? "ສ້າງກຸ່ມສິນຄ້າໃໝ່" : "ແກ້ໄຂການສະແດງໃນ POS"}
          </p>
        </div>
      </div>

      <form
        key={`${mode}-${category.id || "new"}`}
        className="min-h-0 flex-1 overflow-y-auto p-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSave()
        }}
      >
        <div className="space-y-3">
          <TextField
            label="ຊື່ໝວດໝູ່"
            value={category.name}
            required
            onChange={(value) => onChange({ name: value })}
          />
          <TextField
            label="ລຳດັບ"
            value={String(category.sortOrder || "")}
            inputMode="numeric"
            onChange={(value) =>
              onChange({ sortOrder: Number(value.replace(/\D/g, "")) || 0 })
            }
          />
        </div>

        <section className="mt-5 border-y border-[#ded4c8] py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#2f2419]">ສະແດງໃນ POS</h3>
              <p className="mt-1 text-xs font-medium text-[#6f5c49]">
                ປິດເພື່ອເຊື່ອງກຸ່ມສິນຄ້ານີ້ອອກຈາກໜ້າຂາຍ.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({
                  status: category.status === "visible" ? "hidden" : "visible",
                })
              }
              className={cn(
                "flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition",
                category.status === "visible" ? "bg-[#2e7a46]" : "bg-[#d9d2c8]",
              )}
              aria-label="ປ່ຽນສະຖານະໝວດໝູ່"
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full bg-white transition",
                  category.status === "visible" ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#ded4c8] pt-3 text-sm">
            <span className="font-semibold text-[#6f5c49]">ສິນຄ້າທີ່ຜູກຢູ່</span>
            <span className="font-bold text-[#2f2419]">{category.productCount}</span>
          </div>
        </section>

        <div className={cn("mt-5 grid gap-3", mode === "create" && "grid-cols-2")}>
          {mode === "create" ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-11 cursor-pointer items-center justify-center rounded-md border border-[#ded4c8] bg-white text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
            >
              ຍົກເລີກ
            </button>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 cursor-pointer items-center justify-center rounded-md bg-[#2f2419] text-sm font-semibold text-white transition hover:bg-[#3d2e20] disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? "ກຳລັງບັນທຶກ" : "ບັນທຶກ"}
          </button>
        </div>

        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center rounded-md text-sm font-semibold text-[#a83224] transition hover:bg-[#fff7f5]"
          >
            ລຶບໝວດໝູ່
          </button>
        ) : null}
      </form>
    </aside>
  )
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  inputMode,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  inputMode?: "numeric"
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f4032]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#ad9d8c] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      />
    </label>
  )
}
