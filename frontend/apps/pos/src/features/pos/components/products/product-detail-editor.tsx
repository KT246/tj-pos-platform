import { ChevronDown, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"

import type { CafeProductCatalogItem } from "@/features/pos/data/cafe-product-catalog"
import { uploadPosItemImage } from "@/features/pos/api/pos-items-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import {
  ImageField,
  ProductOptionsEditor,
  ProductOptionsPreview,
  type ProductPanelFormValue,
} from "@/features/pos/components/products/product-create-panel"
import { validateImageFile } from "@/features/pos/components/products/product-image-utils"
import {
  defaultCafeOptionGroups,
  normalizeOptionGroupPriceMode,
  type OptionGroup,
} from "@/features/pos/components/products/product-options"
import { formatKipAmount } from "@/features/pos/lib/format"
import type { PosCategory } from "@/features/pos/types"

type ProductDetailEditorProps = {
  product: CafeProductCatalogItem
  categories: PosCategory[]
  onClose: () => void
  onSave: (productId: string, product: ProductPanelFormValue) => Promise<void> | void
  onDelete: (productId: string) => void
}

export function ProductDetailEditor({
  product,
  categories,
  onClose,
  onSave,
  onDelete,
}: ProductDetailEditorProps) {
  const [name, setName] = useState(product.name)
  const [sku, setSku] = useState(product.sku)
  const [category, setCategory] = useState(categoryLabel(product.categoryId, categories))
  const [unit, setUnit] = useState(product.unit)
  const [basePrice, setBasePrice] = useState(product.price)
  const [costPrice, setCostPrice] = useState(product.costPrice)
  const [description, setDescription] = useState(product.description)
  const [image, setImage] = useState(product.image)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [bestSeller, setBestSeller] = useState(product.bestSeller)
  const [availableForSale, setAvailableForSale] = useState(product.visibleOnSales)
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(
    product.optionGroups?.length ? product.optionGroups : defaultCafeOptionGroups,
  )

  useEffect(() => {
    setName(product.name)
    setSku(product.sku)
    setCategory(categoryLabel(product.categoryId, categories))
    setUnit(product.unit)
    setBasePrice(product.price)
    setCostPrice(product.costPrice)
    setDescription(product.description)
    setImage(product.image)
    setSelectedImageFile(null)
    setBestSeller(product.bestSeller)
    setAvailableForSale(product.visibleOnSales)
    setOptionGroups(
      product.optionGroups?.length ? product.optionGroups : defaultCafeOptionGroups,
    )
  }, [categories, product])

  useEffect(() => {
    return () => {
      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image)
      }
    }
  }, [image])

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
        description: "ຮູບຈະຖືກອັບໂຫຼດເມື່ອກົດບັນທຶກການແກ້ໄຂ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດເລືອກຮູບໄດ້",
        description: error instanceof Error ? error.message : "ກະລຸນາລອງໃໝ່.",
      })
    }
  }

  async function saveProduct() {
    const imageUrl = await resolveImageUrlBeforeSave()

    await onSave(product.id, {
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
      status: "active",
    })
  }

  return (
    <aside className="flex h-full min-h-0 w-[420px] shrink-0 flex-col overflow-hidden rounded-lg border border-[#ded4c8] bg-white">
      <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#ded4c8] bg-[#fbfaf7] px-4">
        <h2 className="text-base font-bold text-[#2f2419]">ຂໍ້ມູນສິນຄ້າ</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[#6f5c49] transition hover:bg-[#eee6dc] hover:text-[#2f2419]"
          aria-label="ປິດຂໍ້ມູນສິນຄ້າ"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        key={product.id}
        className="min-h-0 flex-1 overflow-y-auto p-4"
        onSubmit={(event) => {
          event.preventDefault()
          void saveProduct().catch(() => undefined)
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
            <SelectField
              label="ໝວດໝູ່"
              required
              value={category}
              options={categories
                .filter((category) => category.id !== "all")
                .map((category) => category.label)}
              onChange={setCategory}
            />
            <TextField label="ລະຫັດສິນຄ້າ (SKU)" value={sku} onChange={setSku} />
          </div>
        </div>

        <div className="my-5 h-px bg-[#ded4c8]" />

        <div className="grid grid-cols-2 gap-4">
          <MoneyField
            label="ລາຄາຂາຍ"
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

        <section className="mt-5">
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

        <section className="mt-5">
          <h3 className="text-sm font-bold text-[#2f2419]">ຮູບແບບການບໍລິການ</h3>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm font-semibold text-[#4f4032]">
            <RadioField
              label="ກິນທີ່ຮ້ານ"
              name="serviceMode"
              value="dine-in"
              checked={product.serviceMode === "dine-in"}
            />
            <RadioField
              label="ກັບບ້ານ"
              name="serviceMode"
              value="takeaway"
              checked={product.serviceMode === "takeaway"}
            />
            <RadioField
              label="ທັງສອງ"
              name="serviceMode"
              value="both"
              checked={product.serviceMode === "both"}
            />
          </div>
        </section>

        <div className="my-5 h-px bg-[#ded4c8]" />

        <ProductOptionsEditor groups={optionGroups} onChange={setOptionGroups} />

        <ProductOptionsPreview
          groups={optionGroups}
          image={image || product.image}
          name={name}
          unit={unit}
          basePrice={basePrice}
        />

        <div className="mt-6 grid grid-cols-[120px_minmax(0,1fr)] gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 cursor-pointer rounded-md border border-[#ded4c8] bg-white text-sm font-semibold text-[#4f4032] transition hover:bg-[#f6f1ea]"
          >
            ຍົກເລີກ
          </button>
          <button
            type="submit"
            className="h-11 cursor-pointer rounded-md bg-[#2f2419] text-sm font-semibold text-white transition hover:bg-[#3d2e20]"
          >
            ບັນທຶກການແກ້ໄຂ
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#ffd2cb] bg-[#fff7f5] text-sm font-semibold text-[#d04433] transition hover:bg-[#fff0ed]"
        >
          <Trash2 className="h-4 w-4" />
          ລຶບສິນຄ້າ
        </button>
      </form>
    </aside>
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

function RadioField({
  label,
  name,
  value,
  checked,
}: {
  label: string
  name: string
  value: string
  checked: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        className="h-4 w-4 cursor-pointer accent-[#2f2419]"
      />
      {label}
    </label>
  )
}

function categoryLabel(categoryId: string, categories: PosCategory[]) {
  return categories.find((category) => category.id === categoryId)?.label ?? "ອື່ນໆ"
}
