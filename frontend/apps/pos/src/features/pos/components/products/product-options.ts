export type PriceMode = "override" | "addon"

export type OptionChoice = {
  id: string
  name: string
  price: number
  default?: boolean
}

export type OptionGroup = {
  id: string
  name: string
  required: boolean
  multiple: boolean
  priceMode: PriceMode
  choices: OptionChoice[]
}

export function canUseReplacementPrice(group: Pick<OptionGroup, "id" | "name">) {
  const value = `${group.id} ${group.name}`.toLowerCase()

  return (
    value.includes("size") ||
    value.includes("dung tích") ||
    value.includes("dung tich") ||
    value.includes("ml")
  )
}

export function getOptionGroupPriceMode(group: OptionGroup): PriceMode {
  if (group.priceMode === "override" && canUseReplacementPrice(group)) {
    return "override"
  }

  return "addon"
}

export function normalizeOptionGroupPriceMode(group: OptionGroup): OptionGroup {
  if (canUseReplacementPrice(group)) {
    return group
  }

  return { ...group, priceMode: "addon" }
}

export const defaultCafeOptionGroups: OptionGroup[] = [
  {
    id: "size",
    name: "Size",
    required: true,
    multiple: false,
    priceMode: "override",
    choices: [
      { id: "size-s", name: "S (355ml)", price: 32000 },
      { id: "size-m", name: "M (475ml)", price: 35000, default: true },
      { id: "size-l", name: "L (590ml)", price: 39000 },
    ],
  },
  {
    id: "temperature",
    name: "ອຸນຫະພູມ",
    required: true,
    multiple: false,
    priceMode: "addon",
    choices: [
      { id: "hot", name: "ຮ້ອນ", price: 0, default: true },
      { id: "iced", name: "ເຢັນ", price: 0 },
    ],
  },
  {
    id: "sugar",
    name: "ນ້ຳຕານ",
    required: true,
    multiple: false,
    priceMode: "addon",
    choices: [
      { id: "sugar-0", name: "0%", price: 0 },
      { id: "sugar-30", name: "30%", price: 0, default: true },
      { id: "sugar-50", name: "50%", price: 0 },
      { id: "sugar-70", name: "70%", price: 0 },
      { id: "sugar-100", name: "100%", price: 0 },
    ],
  },
  {
    id: "topping",
    name: "Topping",
    required: false,
    multiple: true,
    priceMode: "addon",
    choices: [
      { id: "shot", name: "Shot espresso", price: 8000 },
      { id: "cheese", name: "ຄີມຊີສ", price: 10000 },
      { id: "pearl", name: "ໄຂ່ມຸກ", price: 6000 },
      { id: "jelly", name: "ວຸ້ນກາເຟ", price: 5000 },
    ],
  },
]
