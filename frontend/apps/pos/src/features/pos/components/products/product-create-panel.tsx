import {
  Camera,
  ChevronDown,
  GripVertical,
  ImagePlus,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cafeProductCatalog } from "@/features/pos/data/cafe-product-catalog"
import { uploadPosItemImage } from "@/features/pos/api/pos-items-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { validateImageFile } from "@/features/pos/components/products/product-image-utils"
import { formatKipAmount, formatVnd } from "@/features/pos/lib/format"
import {
  canUseReplacementPrice,
  defaultCafeOptionGroups,
  getOptionGroupPriceMode,
  normalizeOptionGroupPriceMode,
  type OptionChoice,
  type OptionGroup,
} from "@/features/pos/components/products/product-options"
import type { PosCategory } from "@/features/pos/types"
import { cn } from "@/lib/utils"

type ProductCreatePanelProps = {
  categories: PosCategory[]
  onCancel: () => void
  onSave: (product: ProductPanelFormValue) => Promise<void> | void
}

export type ProductPanelFormValue = {
  name: string
  sku: string
  category: string
  unit: string
  basePrice: number
  costPrice: number
  description: string
  image: string | null
  optionGroups: OptionGroup[]
  bestSeller?: boolean
  availableForSale?: boolean
  status?: "active" | "inactive"
}

const defaultProductImage =
  cafeProductCatalog.find((item) => item.id === "latte")?.image ?? ""

export function ProductCreatePanel({
  categories,
  onCancel,
  onSave,
}: ProductCreatePanelProps) {
  const [name, setName] = useState("Latte")
  const [sku, setSku] = useState("LATTE")
  const [category, setCategory] = useState("ກາເຟ")
  const [unit, setUnit] = useState("ແກ້ວ")
  const [basePrice, setBasePrice] = useState(35000)
  const [costPrice, setCostPrice] = useState(15000)
  const [description, setDescription] = useState(
    "ກາເຟ espresso ຜະສົມນົມສົດ ລົດຊາດຫອມນຸ່ມ.",
  )
  const [image, setImage] = useState(defaultProductImage)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [optionGroups, setOptionGroups] = useState(defaultCafeOptionGroups)
  const [bestSeller, setBestSeller] = useState(false)
  const [availableForSale, setAvailableForSale] = useState(true)
  const [saveState, setSaveState] = useState<"idle" | "draft" | "saved">("idle")

  const categoryOptions = categories
    .filter((item) => item.id !== "all")
    .map((item) => item.label)

  useEffect(() => {
    return () => {
      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

  async function saveProduct(status: "active" | "inactive") {
    const imageUrl = await resolveImageUrlBeforeSave()

    await onSave({
      name,
      sku,
      category,
      unit,
      basePrice,
      costPrice,
      description,
      image: imageUrl,
      optionGroups: optionGroups.map(normalizeOptionGroupPriceMode),
      bestSeller,
      availableForSale,
      status,
    })
    setSaveState(status === "inactive" ? "draft" : "saved")
  }

  async function resolveImageUrlBeforeSave() {
    if (!selectedImageFile) {
      return image || null
    }

    try {
      setImageUploading(true)
      const uploadedImage = await uploadPosItemImage(selectedImageFile)
      setImage(uploadedImage.url)
      setSelectedImageFile(null)

      return uploadedImage.url
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດອັບໂຫຼດຮູບໄດ້",
        description: error instanceof Error ? error.message : "ກະລຸນາລອງໃໝ່.",
      })
      throw error
    } finally {
      setImageUploading(false)
    }
  }

  function handleImageFile(file: File) {
    try {
      validateImageFile(file)
      setSelectedImageFile(file)
      setImage(URL.createObjectURL(file))
      showPosToast({
        type: "info",
        title: "ເລືອກຮູບສິນຄ້າແລ້ວ",
        description: "ຮູບຈະຖືກອັບໂຫຼດເມື່ອກົດບັນທຶກ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດເລືອກຮູບໄດ້",
        description: error instanceof Error ? error.message : "ກະລຸນາລອງໃໝ່.",
      })
    }
  }

  return (
    <aside className="flex h-full min-h-0 w-[420px] shrink-0 flex-col overflow-hidden rounded-lg border border-[#ded4c8] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
        <h2 className="text-base font-bold text-[#2f2419]">ເພີ່ມສິນຄ້າ</h2>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[#6f5c49] transition hover:bg-[#eee6dc] hover:text-[#2f2419]"
          aria-label="ປິດຟອມເພີ່ມສິນຄ້າ"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        className="min-h-0 flex-1 overflow-y-auto p-4"
        onSubmit={(event) => {
          event.preventDefault()
          void saveProduct("active").catch(() => undefined)
        }}
      >
        <div className="grid grid-cols-[154px_minmax(0,1fr)] gap-5">
          <ImageField
            image={image}
            name={name}
            uploading={imageUploading}
            onClear={() => {
              setSelectedImageFile(null)
              setImage("")
            }}
            onFileSelect={handleImageFile}
          />

          <div className="space-y-4">
            <TextField label="ຊື່ສິນຄ້າ" required value={name} onChange={setName} />
            <TextField label="ລະຫັດສິນຄ້າ (SKU)" value={sku} onChange={setSku} />
            <SelectField
              label="ໝວດໝູ່"
              required
              value={category}
              options={categoryOptions}
              onChange={setCategory}
            />
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-2 gap-4">
          <MoneyField
            label="ລາຄາພື້ນຖານ"
            required
            value={basePrice}
            onChange={setBasePrice}
          />
          <MoneyField label="ຕົ້ນທຶນ" value={costPrice} onChange={setCostPrice} />
          <SelectField
            label="ຫົວໜ່ວຍ"
            required
            value={unit}
            options={["ແກ້ວ", "ອັນ", "ສ່ວນ", "ຂວດ"]}
            onChange={setUnit}
          />
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-[#4f4032]">ຄຳອະທິບາຍ</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 h-[82px] w-full resize-none rounded-md border border-[#ded4c8] bg-white px-3 py-2.5 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#ad9d8c] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
          />
        </label>

        <Divider />

        <section>
          <h3 className="text-sm font-bold text-[#2f2419]">ຕົວເລືອກ</h3>
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#4f4032]">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(event) => setBestSeller(event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-[#cbbba8] accent-[#2f2419]"
            />
            ສິນຄ້າຂາຍດີ
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#4f4032]">
            <input
              type="checkbox"
              checked={availableForSale}
              onChange={(event) => setAvailableForSale(event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-[#cbbba8] accent-[#2f2419]"
            />
            ສະແດງໃນໜ້າຂາຍ
          </label>
        </section>

        <Divider />

        <ProductOptionsEditor groups={optionGroups} onChange={setOptionGroups} />

        <ProductOptionsPreview
          groups={optionGroups}
          image={image || defaultProductImage}
          name={name}
          unit={unit}
          basePrice={basePrice}
        />

        {saveState !== "idle" ? (
          <div className="mt-4 rounded-md border border-[#e5d1ad] bg-[#fff8e8] px-3 py-2.5 text-sm font-semibold text-[#7a572f]">
            {saveState === "draft"
              ? "ບັນທຶກແບບຮ່າງແລ້ວ."
              : "ບັນທຶກສິນຄ້າແລ້ວ."}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-[0.75fr_0.95fr_1fr] gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 cursor-pointer rounded-md border border-[#ded4c8] bg-white text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            onClick={() => void saveProduct("inactive").catch(() => undefined)}
            className="h-11 cursor-pointer rounded-md border border-[#ded4c8] bg-[#fbfaf7] text-sm font-semibold text-[#4f4032] transition hover:bg-[#f1e8dd]"
          >
            ບັນທຶກຮ່າງ
          </button>
          <button
            type="submit"
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#2f2419] text-sm font-semibold text-white transition hover:bg-[#3d2e20]"
          >
            <Save className="h-4 w-4" />
            ບັນທຶກ
          </button>
        </div>
      </form>
    </aside>
  )
}

export function ProductOptionsEditor({
  groups,
  onChange,
}: {
  groups: OptionGroup[]
  onChange: (groups: OptionGroup[]) => void
}) {
  function updateGroup(groupId: string, nextGroup: Partial<OptionGroup>) {
    onChange(
      groups.map((group) => {
        if (group.id !== groupId) return group

        return normalizeOptionGroupPriceMode({ ...group, ...nextGroup })
      }),
    )
  }

  function updateChoice(
    groupId: string,
    choiceId: string,
    nextChoice: Partial<OptionChoice>,
  ) {
    onChange(
      groups.map((group) => {
        if (group.id !== groupId) return group

        return {
          ...group,
          choices: group.choices.map((choice) =>
            choice.id === choiceId ? { ...choice, ...nextChoice } : choice,
          ),
        }
      }),
    )
  }

  function setDefaultChoice(groupId: string, choiceId: string) {
    onChange(
      groups.map((group) => {
        if (group.id !== groupId) return group

        return {
          ...group,
          choices: group.choices.map((choice) => ({
            ...choice,
            default: choice.id === choiceId,
          })),
        }
      }),
    )
  }

  function addChoice(groupId: string) {
    onChange(
      groups.map((group) => {
        if (group.id !== groupId) return group

        return {
          ...group,
          choices: [
            ...group.choices,
            { id: `${groupId}-${Date.now()}`, name: "ຕົວເລືອກໃໝ່", price: 0 },
          ],
        }
      }),
    )
  }

  function removeChoice(groupId: string, choiceId: string) {
    onChange(
      groups.map((group) => {
        if (group.id !== groupId || group.choices.length <= 1) return group

        return {
          ...group,
          choices: group.choices.filter((choice) => choice.id !== choiceId),
        }
      }),
    )
  }

  function addGroup() {
    const groupId = `group-${Date.now()}`

    onChange([
      ...groups,
      {
        id: groupId,
        name: "ກຸ່ມຕົວເລືອກໃໝ່",
        required: false,
        multiple: false,
        priceMode: "addon",
        choices: [
          {
            id: `${groupId}-choice-1`,
            name: "ຕົວເລືອກໃໝ່",
            price: 0,
            default: false,
          },
        ],
      },
    ])

    showPosToast({
      type: "info",
      title: "ເພີ່ມກຸ່ມຕົວເລືອກແລ້ວ",
      description: "ກຸ່ມນີ້ຈະຖືກບັນທຶກເມື່ອກົດບັນທຶກສິນຄ້າ.",
    })
  }

  function removeGroup(groupId: string) {
    if (groups.length <= 1) {
      showPosToast({
        type: "warning",
        title: "ບໍ່ສາມາດລຶບກຸ່ມສຸດທ້າຍໄດ້",
        description: "ສິນຄ້າຕ້ອງມີຢ່າງນ້ອຍ 1 ກຸ່ມຕົວເລືອກ.",
      })
      return
    }

    onChange(groups.filter((group) => group.id !== groupId))
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#2f2419]">ຕົວເລືອກສິນຄ້າ</h3>
          <p className="mt-1 text-xs font-semibold text-[#8a7560]">
            ຕັ້ງຄ່າ size, ອຸນຫະພູມ, ນ້ຳຕານ ແລະ topping ສຳລັບ POS.
          </p>
        </div>
        <button
          type="button"
          onClick={addGroup}
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-[#ded4c8] bg-white px-3 text-xs font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
        >
          <Plus className="h-4 w-4" />
          ກຸ່ມ
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {groups.map((group) => (
          <OptionGroupEditor
            key={group.id}
            group={group}
            onUpdateGroup={(nextGroup) => updateGroup(group.id, nextGroup)}
            onUpdateChoice={(choiceId, nextChoice) =>
              updateChoice(group.id, choiceId, nextChoice)
            }
            onAddChoice={() => addChoice(group.id)}
            onRemoveChoice={(choiceId) => removeChoice(group.id, choiceId)}
            onRemoveGroup={() => removeGroup(group.id)}
            onSetDefault={(choiceId) => setDefaultChoice(group.id, choiceId)}
          />
        ))}
      </div>
    </section>
  )
}

export function ProductOptionsPreview({
  groups,
  image,
  name,
  unit,
  basePrice,
}: {
  groups: OptionGroup[]
  image: string
  name: string
  unit: string
  basePrice: number
}) {
  const previewPrice = useMemo(() => {
    const sizeGroup = groups.find((group) => group.id === "size")
    const defaultSize =
      sizeGroup?.choices.find((choice) => choice.default) ?? sizeGroup?.choices[0]

    return sizeGroup && getOptionGroupPriceMode(sizeGroup) === "override" && defaultSize
      ? defaultSize.price
      : basePrice
  }, [basePrice, groups])

  return (
    <section className="mt-5 rounded-md border border-[#ded4c8] bg-[#fffdf9] p-3">
      <div className="flex gap-3">
        <img
          src={image}
          alt={name}
          className="h-16 w-16 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[#2f2419]">
            {name || "ຊື່ສິນຄ້າ"}
          </h3>
          <p className="mt-1 text-sm font-bold text-[#7c6448]">{unit}</p>
          <p className="mt-1 text-sm font-semibold text-[#2e7a46]">
            ຄ່າເລີ່ມຕົ້ນ: {formatVnd(previewPrice)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {groups.map((group) => (
          <PreviewGroup key={group.id} group={group} />
        ))}
      </div>

      <div className="mt-4 flex gap-3 rounded-md border border-[#e5d1ad] bg-[#fff8e8] p-3 text-xs font-semibold text-[#6f5c49]">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#c18734]" />
        ລາຄາໃນ POS ຈະອ່ານຕາມການຕັ້ງຄ່າຕົວເລືອກຂອງສິນຄ້າ.
      </div>
    </section>
  )
}

function OptionGroupEditor({
  group,
  onUpdateGroup,
  onUpdateChoice,
  onAddChoice,
  onRemoveChoice,
  onRemoveGroup,
  onSetDefault,
}: {
  group: OptionGroup
  onUpdateGroup: (group: Partial<OptionGroup>) => void
  onUpdateChoice: (choiceId: string, choice: Partial<OptionChoice>) => void
  onAddChoice: () => void
  onRemoveChoice: (choiceId: string) => void
  onRemoveGroup: () => void
  onSetDefault: (choiceId: string) => void
}) {
  const canUseReplacement = canUseReplacementPrice(group)
  const priceMode = getOptionGroupPriceMode(group)

  return (
    <article className="rounded-md border border-[#ded4c8] bg-[#fffaf4] p-3">
      <div className="flex items-center gap-2">
        <GripVertical className="h-5 w-5 shrink-0 text-[#b7a48f]" />
        <input
          value={group.name}
          onChange={(event) => onUpdateGroup({ name: event.target.value })}
          className="min-w-0 flex-1 rounded-md border border-transparent bg-white px-3 py-2 text-sm font-semibold text-[#2f2419] outline-none focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
        />
        <span
          className={cn(
            "shrink-0 rounded px-2 py-1 text-[11px] font-semibold",
            priceMode === "override"
              ? "bg-[#f1e7ff] text-[#7b4ed0]"
              : "bg-[#e9f5ff] text-[#2673b8]",
          )}
        >
          {priceMode === "override" ? "ລາຄາແທນ" : "ບວກເພີ່ມ"}
        </span>
        <button
          type="button"
          onClick={onRemoveGroup}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#d04433] transition hover:bg-[#fff0ed]"
          aria-label="ລຶບກຸ່ມຕົວເລືອກ"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <ToggleButton
          active={group.required}
          label={group.required ? "ຈຳເປັນ" : "ບໍ່ຈຳເປັນ"}
          onClick={() => onUpdateGroup({ required: !group.required })}
        />
        <ToggleButton
          active={group.multiple}
          label={group.multiple ? "ເລືອກຫຼາຍ" : "ເລືອກ 1"}
          onClick={() => onUpdateGroup({ multiple: !group.multiple })}
        />
        <ToggleButton
          active={priceMode === "override"}
          disabled={!canUseReplacement}
          label="ລາຄາແທນ"
          onClick={() => onUpdateGroup({ priceMode: "override" })}
        />
        <ToggleButton
          active={priceMode === "addon"}
          label="ບວກເພີ່ມ"
          onClick={() => onUpdateGroup({ priceMode: "addon" })}
        />
      </div>

      <div className="mt-3 space-y-2">
        {group.choices.map((choice) => (
          <div
            key={choice.id}
            className="grid grid-cols-[minmax(0,1fr)_86px_34px] gap-2"
          >
            <input
              value={choice.name}
              onChange={(event) =>
                onUpdateChoice(choice.id, { name: event.target.value })
              }
              className="h-10 min-w-0 rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-semibold text-[#2f2419] outline-none focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
            />
            <input
              value={choice.price ? formatKipAmount(choice.price) : "0"}
              onChange={(event) =>
                onUpdateChoice(choice.id, {
                  price: Number(event.target.value.replace(/\D/g, "")),
                })
              }
              className="h-10 rounded-md border border-[#ded4c8] bg-white px-2 text-right text-sm font-semibold text-[#2f2419] outline-none focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
            />
            <button
              type="button"
              onClick={() => onRemoveChoice(choice.id)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-[#d04433] transition hover:bg-[#fff0ed]"
              aria-label="ລຶບຕົວເລືອກ"
            >
              <X className="h-4 w-4" />
            </button>
            {!group.multiple ? (
              <button
                type="button"
                onClick={() => onSetDefault(choice.id)}
                className={cn(
                  "col-span-3 h-8 cursor-pointer rounded-md text-xs font-semibold transition",
                  choice.default
                    ? "bg-[#e8f7ed] text-[#148247]"
                    : "bg-white text-[#7c6448] hover:bg-[#efe5d8]",
                )}
              >
                {choice.default ? "ຄ່າເລີ່ມຕົ້ນ" : "ຕັ້ງເປັນຄ່າເລີ່ມຕົ້ນ"}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddChoice}
        className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#c8b398] bg-white text-sm font-semibold text-[#6f5c49] transition hover:bg-[#f6f1ea]"
      >
        <Plus className="h-4 w-4" />
        ເພີ່ມຕົວເລືອກ
      </button>
    </article>
  )
}

function PreviewGroup({ group }: { group: OptionGroup }) {
  return (
    <div className="border-t border-[#ded4c8] pt-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-[#2f2419]">
          {group.name} ({group.multiple ? "ເລືອກຫຼາຍ" : "ເລືອກ 1"})
        </h4>
        <span className="text-xs font-semibold text-[#6f5c49]">
          {group.required ? "ຈຳເປັນ" : "ບໍ່ຈຳເປັນ"}
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {group.choices.map((choice) => (
          <div
            key={choice.id}
            className="flex items-center justify-between gap-3 text-sm font-semibold text-[#5f4a35]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a5f36]" />
              <span className="truncate">{choice.name}</span>
              {choice.default ? (
                <span className="rounded bg-[#e8f7ed] px-2 py-0.5 text-[11px] font-semibold text-[#2e7a46]">
                  ຄ່າເລີ່ມຕົ້ນ
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-semibold text-[#2f2419]">
              {getOptionGroupPriceMode(group) === "override"
                ? formatVnd(choice.price)
                : `+${formatVnd(choice.price)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ImageField({
  image,
  name,
  uploading = false,
  onClear,
  onFileSelect,
}: {
  image: string
  name: string
  uploading?: boolean
  onClear: () => void
  onFileSelect: (file: File) => Promise<void> | void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div>
      <div className="relative h-[154px] overflow-hidden rounded-md bg-[#f5ede3]">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#8a5f36]">
            <ImagePlus className="h-9 w-9" />
          </div>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#ded4c8] bg-white text-[#4f4032] transition hover:bg-[#f6f1ea] disabled:cursor-wait disabled:opacity-75"
          aria-label="ປ່ຽນຮູບສິນຄ້າ"
        >
          {uploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#ded4c8] border-t-[#2f2419]" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]

            if (file) {
              void onFileSelect(file)
            }

            event.target.value = ""
          }}
        />
      </div>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#ffd2cb] bg-[#fff7f5] text-xs font-semibold text-[#d04433] transition hover:bg-[#fff0ed]"
      >
        <Trash2 className="h-3.5 w-3.5" />
        ລຶບຮູບ
      </button>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f4032]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-[#ded4c8] bg-white px-3 text-sm font-medium text-[#2f2419] outline-none transition placeholder:text-[#ad9d8c] focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      />
    </label>
  )
}

function MoneyField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4f4032]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <span className="mt-2 flex h-10 items-center rounded-md border border-[#ded4c8] bg-white px-3 focus-within:border-[#8d7157] focus-within:ring-2 focus-within:ring-[#e5d7c7]">
        <input
          value={value ? formatKipAmount(value) : ""}
          onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")))}
          inputMode="numeric"
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#2f2419] outline-none"
        />
        <span className="ml-2 text-sm font-semibold text-[#6f5c49]">ກີບ</span>
      </span>
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="relative block">
      <span className="text-sm font-semibold text-[#4f4032]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full cursor-pointer appearance-none rounded-md border border-[#ded4c8] bg-white px-3 pr-10 text-sm font-medium text-[#2f2419] outline-none transition focus:border-[#8d7157] focus:ring-2 focus:ring-[#e5d7c7]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-[#8a5f36]" />
    </label>
  )
}

function ToggleButton({
  active,
  label,
  onClick,
  disabled = false,
}: {
  active: boolean
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 cursor-pointer rounded-md border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        active
          ? "border-[#b99668] bg-[#fff3dd] text-[#4f4032]"
          : "border-[#ded4c8] bg-white text-[#6f5c49] hover:bg-[#f6f1ea]",
      )}
    >
      {label}
    </button>
  )
}

function Divider() {
  return <div className="my-5 h-px bg-[#ded4c8]" />
}
