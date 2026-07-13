import { Check, CirclePlus, Minus, Plus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { formatVnd } from "@/features/pos/lib/format"
import {
  getOptionGroupPriceMode,
  type OptionChoice,
  type OptionGroup,
} from "@/features/pos/components/products/product-options"
import type { CartLine, CartLineOptions } from "@/features/pos/stores/pos-store"
import type { PosProduct } from "@/features/pos/types"
import { cn } from "@/lib/utils"

type ItemOptionsModalProps = {
  product: PosProduct | null
  line?: CartLine | null
  open: boolean
  onClose: () => void
  onSave: (payload: {
    product: PosProduct
    lineId?: string
    quantity: number
    unitPrice: number
    note: string
    options: CartLineOptions
  }) => void
}

type SelectedChoiceIds = Record<string, string[]>

export function ItemOptionsModal({
  product,
  line,
  open,
  onClose,
  onSave,
}: ItemOptionsModalProps) {
  const optionGroups = useMemo(() => product?.optionGroups ?? [], [product])
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<SelectedChoiceIds>({})
  const [itemNote, setItemNote] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!open || !product) return

    setSelectedChoiceIds(buildInitialSelection(optionGroups, line?.options))
    setItemNote(line?.options?.itemNote ?? "")
    setQuantity(line?.quantity ?? 1)
  }, [line, open, optionGroups, product])

  const selectedOptions = useMemo(
    () => buildSelectedOptions(optionGroups, selectedChoiceIds),
    [optionGroups, selectedChoiceIds],
  )

  const unitPrice = useMemo(() => {
    if (!product) return 0

    return calculateUnitPrice(product.price, selectedOptions)
  }, [product, selectedOptions])

  if (!open || !product) return null

  function toggleChoice(group: OptionGroup, choice: OptionChoice) {
    setSelectedChoiceIds((current) => {
      const currentIds = current[group.id] ?? []

      if (group.multiple) {
        const nextIds = currentIds.includes(choice.id)
          ? currentIds.filter((id) => id !== choice.id)
          : [...currentIds, choice.id]

        return { ...current, [group.id]: nextIds }
      }

      if (!group.required && currentIds.includes(choice.id)) {
        return { ...current, [group.id]: [] }
      }

      return { ...current, [group.id]: [choice.id] }
    })
  }

  function handleSave() {
    if (!product) return

    const noteParts = selectedOptions
      .flatMap((group) => group.choices.map((choice) => choice.name))
      .concat(itemNote.trim() ? [itemNote.trim()] : [])

    onSave({
      product,
      lineId: line?.id,
      quantity,
      unitPrice,
      note: noteParts.join(", "),
      options: {
        groups: selectedOptions,
        itemNote,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6 backdrop-blur-[2px]">
      <div className="w-full max-w-[650px] overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-[0_28px_80px_rgba(31,18,8,0.34)]">
        <div className="flex h-16 items-center justify-between px-6">
          <h2 className="text-2xl font-black text-[#3b2511]">ຕົວເລືອກສິນຄ້າ</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#7c6448] transition hover:bg-[#fbf4ea]"
            aria-label="ປິດຕົວເລືອກສິນຄ້າ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-170px)] overflow-y-auto px-4 pb-4">
          <div className="rounded-xl border border-[#eadfce] p-4">
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-[86px] w-[104px] rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black text-[#3b2511]">{product.name}</h3>
                <p className="mt-2 text-sm font-bold text-[#7c6448]">
                  ລາຄາພື້ນຖານ: {formatVnd(product.price)}
                </p>
                {typeof product.stock === "number" ? (
                  <p className="mt-1 text-xs font-black text-[#148247]">
                    ຄົງເຫຼືອ: {product.stock.toLocaleString("vi-VN")} {product.unit ?? ""}
                  </p>
                ) : null}
              </div>

              <div className="text-center">
                <p className="mb-2 text-sm font-bold text-[#5f4a35]">ຈຳນວນ</p>
                <div className="flex items-center gap-3">
                  <QuantityButton
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    icon={Minus}
                  />
                  <span className="min-w-6 text-center text-lg font-black">
                    {quantity}
                  </span>
                  <QuantityButton
                    onClick={() => setQuantity((value) => value + 1)}
                    icon={Plus}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-[#eadfce] pt-4">
              {optionGroups.length ? (
                optionGroups.map((group) => (
                  <OptionGroupRow
                    key={group.id}
                    group={group}
                    selectedIds={selectedChoiceIds[group.id] ?? []}
                    onToggleChoice={(choice) => toggleChoice(group, choice)}
                  />
                ))
              ) : (
                <div className="rounded-xl bg-[#fbf4ea] px-4 py-3 text-sm font-bold text-[#7c6448]">
                  ສິນຄ້ານີ້ບໍ່ມີຕົວເລືອກເພີ່ມ.
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-4 border-t border-[#eadfce] pt-4">
              <label className="w-[96px] pt-3 text-sm font-black text-[#5f4a35]">
                ໝາຍເຫດ
              </label>
              <label className="relative min-w-0 flex-1">
                <textarea
                  value={itemNote}
                  onChange={(event) => setItemNote(event.target.value.slice(0, 200))}
                  className="h-[78px] w-full resize-none rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#3b2511] outline-none focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
                  placeholder="ຕົວຢ່າງ: ຫວານນ້ອຍ, ບໍ່ໃສ່ຫຼອດ..."
                />
                <span className="absolute bottom-3 right-4 text-xs font-bold text-[#9a8064]">
                  {itemNote.length}/200
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex h-[96px] items-center justify-between border-t border-[#eadfce] px-6">
          <div>
            <p className="text-sm font-bold text-[#7c6448]">ລວມ</p>
            <p className="text-3xl font-black text-[#3b2511]">
              {formatVnd(unitPrice * quantity)}
            </p>
            <p className="text-xs font-bold text-[#9a8064]">ຕໍ່ລາຍການ: {formatVnd(unitPrice)}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 min-w-[140px] cursor-pointer rounded-lg border border-[#eadfce] bg-white px-6 text-sm font-black text-[#5f4a35] transition hover:bg-[#fbf4ea]"
            >
              ຍົກເລີກ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex h-12 min-w-[210px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#5a3718_0%,#3b2511_100%)] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(75,50,26,0.24)] transition hover:brightness-110"
            >
              <CirclePlus className="h-5 w-5" />
              {line ? "ອັບເດດລາຍການ" : "ເພີ່ມເຂົ້າອໍເດີ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OptionGroupRow({
  group,
  selectedIds,
  onToggleChoice,
}: {
  group: OptionGroup
  selectedIds: string[]
  onToggleChoice: (choice: OptionChoice) => void
}) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-[#eadfce] py-3 last:border-b-0">
      <div>
        <p className="text-sm font-black text-[#5f4a35]">{group.name}</p>
        <p className="mt-1 text-[11px] font-bold text-[#9a8064]">
          {group.required ? "ບັງຄັບ" : "ບໍ່ບັງຄັບ"} / {group.multiple ? "ເລືອກຫຼາຍ" : "ເລືອກ 1"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.choices.map((choice) => {
          const active = selectedIds.includes(choice.id)

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onToggleChoice(choice)}
              className={cn(
                "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-black transition",
                active
                  ? "border-[#5a3718] bg-[#5a3718] text-white"
                  : "border-[#eadfce] bg-white text-[#5f4a35] hover:bg-[#fbf4ea]",
              )}
            >
              {group.multiple ? (
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    active
                      ? "border-white bg-white text-[#5a3718]"
                      : "border-[#d7c4ab] text-transparent",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
              ) : null}
              <span>{choice.name}</span>
              <span className="text-xs font-bold opacity-80">
                {getOptionGroupPriceMode(group) === "override"
                  ? formatVnd(choice.price)
                  : `+${formatVnd(choice.price)}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuantityButton({
  icon: Icon,
  onClick,
}: {
  icon: typeof Plus
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#4b321a] transition hover:bg-[#f8f1e8]"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function buildInitialSelection(
  groups: OptionGroup[],
  savedOptions?: CartLineOptions,
): SelectedChoiceIds {
  if (savedOptions?.groups.length) {
    return Object.fromEntries(
      savedOptions.groups.map((group) => [
        group.groupId,
        group.choices.map((choice) => choice.id),
      ]),
    )
  }

  return Object.fromEntries(
    groups.map((group) => {
      if (!group.required) {
        return [group.id, []]
      }

      const defaultChoices = group.choices.filter((choice) => choice.default)
      const choices =
        defaultChoices.length > 0
          ? defaultChoices
          : group.multiple
            ? []
            : group.choices.slice(0, 1)

      return [group.id, choices.map((choice) => choice.id)]
    }),
  )
}

function buildSelectedOptions(
  groups: OptionGroup[],
  selectedChoiceIds: SelectedChoiceIds,
): CartLineOptions["groups"] {
  return groups
    .map((group) => {
      const choiceIds = selectedChoiceIds[group.id] ?? []
      const choices = group.choices
        .filter((choice) => choiceIds.includes(choice.id))
        .map((choice) => ({
          id: choice.id,
          name: choice.name,
          price: choice.price,
        }))

      return {
        groupId: group.id,
        groupName: group.name,
        multiple: group.multiple,
        priceMode: getOptionGroupPriceMode(group),
        choices,
      }
    })
    .filter((group) => group.choices.length > 0)
}

function calculateUnitPrice(
  basePrice: number,
  groups: CartLineOptions["groups"],
) {
  let overridePrice: number | null = null
  let addonPrice = 0

  for (const group of groups) {
    for (const choice of group.choices) {
      if (group.priceMode === "override") {
        overridePrice = choice.price
      } else {
        addonPrice += choice.price
      }
    }
  }

  return Math.max(0, (overridePrice ?? basePrice) + addonPrice)
}
