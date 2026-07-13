import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Bell,
  Building2,
  CalendarClock,
  Camera,
  CreditCard,
  Database,
  Gift,
  Home,
  ImagePlus,
  KeyRound,
  Palette,
  Percent,
  Printer,
  RefreshCw,
  ReceiptText,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  getPosSettings,
  runPosSettingsBackup,
  updatePosAppearanceSettings,
  updatePosBusinessSettings,
  updatePosCustomerSettings,
  updatePosNotificationSettings,
  updatePosOpeningHours,
  updatePosPaymentSettings,
  updatePosPrinterSettings,
  updatePosReceiptSettings,
  updatePosTableSettings,
  updatePosTaxSettings,
  type PosAppearanceSetting,
  type PosCustomerSetting,
  type PosNotificationSetting,
  type PosOpeningHour,
  type PosPaymentMethodSetting,
  type PosPrinterSetting,
  type PosReceiptSetting,
  type PosSettingsBusiness,
  type PosTableSetting,
  type PosTaxSetting,
  type SettingSectionId,
} from "@/features/pos/api/pos-settings-api"
import { uploadPosItemImage } from "@/features/pos/api/pos-items-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { validateImageFile } from "@/features/pos/components/products/product-image-utils"
import { SettingsTopbar } from "@/features/pos/components/settings/settings-topbar"
import { PosAccountsSettingsPanel } from "@/features/pos/components/settings/pos-accounts-settings-panel"
import { formatKip, formatKipAmount } from "@/features/pos/lib/format"
import { cafePosConfig } from "@/features/pos/pos-types/cafe/config"
import { cn } from "@/lib/utils"

type SettingSection = {
  id: Exclude<SettingSectionId, "permissions" | "branches">
  label: string
}

const settingSections: SettingSection[] = [
  { id: "business", label: "ຂໍ້ມູນຮ້ານ" },
  { id: "tables", label: "ໂຕະ" },
  { id: "customers", label: "ລູກຄ້າ" },
  { id: "payments", label: "ການຊຳລະ" },
  { id: "printers", label: "ເຄື່ອງພິມ" },
  { id: "invoices", label: "ໃບບິນ" },
  { id: "taxes", label: "ພາສີ / ຄ່າທຳນຽມ" },
  { id: "appearance", label: "ໜ້າຕາ" },
  { id: "backup", label: "ສຳຮອງຂໍ້ມູນ" },
  { id: "notifications", label: "ແຈ້ງເຕືອນ" },
  { id: "pos-accounts", label: "ບັນຊີ POS" },
]

const settingSectionIds = new Set<SettingSection["id"]>(
  settingSections.map((section) => section.id),
)
const activeSettingSectionStorageKey = "tj_pos_settings_active_section"

const sectionIcons: Record<SettingSection["id"], ComponentType<{ className?: string }>> = {
  business: Home,
  tables: Home,
  customers: Gift,
  payments: CreditCard,
  printers: Printer,
  invoices: ReceiptText,
  taxes: ShieldCheck,
  appearance: Palette,
  backup: Database,
  notifications: Bell,
  "pos-accounts": KeyRound,
}

const emptyBusiness: PosSettingsBusiness = {
  name: "",
  type: "cafe",
  status: "active",
  phone: "",
  email: "",
  address: "",
  coverImageUrl: "",
  logoUrl: "",
}

const emptyPrinter: PosPrinterSetting = {
  receiptPrinter: "",
  kitchenPrinter: "",
  autoPrintReceipt: true,
  autoPrintKitchen: true,
}

const emptyTax: PosTaxSetting = {
  vatRate: 0,
  serviceFeeRate: 0,
  roundingMode: "none",
}

const emptyReceipt: PosReceiptSetting = {
  prefix: "",
  footer: "",
  paperSize: "80mm",
  showLogo: true,
  showTax: true,
  showQr: false,
  qrImageUrl: "",
}

const emptyAppearance: PosAppearanceSetting = {
  themeMode: "light",
  accentColor: "#8A5425",
}

const emptyNotifications: PosNotificationSetting = {
  stockAlerts: true,
  orderAlerts: true,
  dailyReportEmail: false,
}

const emptyTables: PosTableSetting = {
  tableCount: 12,
}

const emptyCustomers: PosCustomerSetting = {
  enabled: true,
  codePrefix: "CM",
  earnAmount: 10000,
  pointValue: 1000,
  maxRedeemRate: 20,
}

export function PosSettingsPage() {
  const config = cafePosConfig
  const queryClient = useQueryClient()
  const [activeSectionId, setActiveSectionId] =
    useState<SettingSection["id"]>(getStoredActiveSettingSection)
  const [businessDraft, setBusinessDraft] =
    useState<PosSettingsBusiness>(emptyBusiness)
  const [openingHoursDraft, setOpeningHoursDraft] = useState<PosOpeningHour[]>([])
  const [tableDraft, setTableDraft] = useState<PosTableSetting>(emptyTables)
  const [customerDraft, setCustomerDraft] =
    useState<PosCustomerSetting>(emptyCustomers)
  const [paymentsDraft, setPaymentsDraft] = useState<PosPaymentMethodSetting[]>([])
  const [printerDraft, setPrinterDraft] = useState<PosPrinterSetting>(emptyPrinter)
  const [taxDraft, setTaxDraft] = useState<PosTaxSetting>(emptyTax)
  const [receiptDraft, setReceiptDraft] = useState<PosReceiptSetting>(emptyReceipt)
  const [appearanceDraft, setAppearanceDraft] =
    useState<PosAppearanceSetting>(emptyAppearance)
  const [notificationsDraft, setNotificationsDraft] =
    useState<PosNotificationSetting>(emptyNotifications)
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [selectedQrFile, setSelectedQrFile] = useState<File | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [qrUploading, setQrUploading] = useState(false)

  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: getPosSettings,
    refetchOnMount: "always",
  })
  const settings = settingsQuery.data
  const activeSectionLabel = useMemo(
    () => settingSections.find((section) => section.id === activeSectionId)?.label ?? "ຕັ້ງຄ່າ",
    [activeSectionId],
  )

  useEffect(() => {
    if (!settings) return

    setBusinessDraft(normalizeBusinessName(settings.business, config.brandName))
    setOpeningHoursDraft(settings.openingHours)
    setTableDraft(settings.tables)
    setCustomerDraft(settings.customers ?? emptyCustomers)
    setPaymentsDraft(settings.payments)
    setPrinterDraft(settings.printer)
    setTaxDraft(settings.tax)
    setReceiptDraft({
      ...settings.receipt,
      paperSize: settings.receipt.paperSize ?? "80mm",
    })
    setAppearanceDraft(settings.appearance)
    setNotificationsDraft(settings.notifications)
    setSelectedLogoFile(null)
    setSelectedQrFile(null)
  }, [config.brandName, settings])

  useEffect(() => {
    return () => {
      if (businessDraft.logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(businessDraft.logoUrl)
      }
    }
  }, [businessDraft.logoUrl])

  useEffect(() => {
    return () => {
      if (receiptDraft.qrImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(receiptDraft.qrImageUrl)
      }
    }
  }, [receiptDraft.qrImageUrl])

  function handleSelectSection(sectionId: SettingSection["id"]) {
    setActiveSectionId(sectionId)
    window.localStorage.setItem(activeSettingSectionStorageKey, sectionId)
  }

  function handleLogoFile(file: File) {
    try {
      validateImageFile(file)
      setSelectedLogoFile(file)
      setBusinessDraft((current) => ({ ...current, logoUrl: URL.createObjectURL(file) }))
      showPosToast({
        type: "info",
        title: "ເລືອກ logo ແລ້ວ",
        description: "Logo ຈະຖືກອັບໂຫຼດເມື່ອກົດບັນທຶກໃບບິນ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດເລືອກ logo ໄດ້",
        description: error instanceof Error ? error.message : "ກະລຸນາລອງໃໝ່.",
      })
    }
  }

  function handleQrFile(file: File) {
    try {
      validateImageFile(file)
      setSelectedQrFile(file)
      setReceiptDraft((current) => ({
        ...current,
        qrImageUrl: URL.createObjectURL(file),
        showQr: true,
      }))
      showPosToast({
        type: "info",
        title: "ເລືອກ QR ແລ້ວ",
        description: "QR ຈະຖືກອັບໂຫຼດເມື່ອກົດບັນທຶກໃບບິນ.",
      })
    } catch (error) {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດເລືອກ QR ໄດ້",
        description: error instanceof Error ? error.message : "ກະລຸນາລອງໃໝ່.",
      })
    }
  }

  function handleSaved(title: string) {
    return async (nextSettings: NonNullable<typeof settings>) => {
      queryClient.setQueryData(["pos-settings"], nextSettings)
      showPosToast({
        type: "success",
        title,
        description: "ການຕັ້ງຄ່າ POS ຖືກອັບເດດແລ້ວ.",
      })
    }
  }

  function handleSaveError() {
    showPosToast({
      type: "error",
      title: "ບໍ່ສາມາດບັນທຶກການຕັ້ງຄ່າໄດ້",
      description: "ກະລຸນາກວດຂໍ້ມູນ ແລ້ວລອງໃໝ່.",
    })
  }

  const businessMutation = useMutation({
    mutationFn: updatePosBusinessSettings,
    onSuccess: handleSaved("ບັນທຶກຂໍ້ມູນຮ້ານແລ້ວ"),
    onError: handleSaveError,
  })
  const hoursMutation = useMutation({
    mutationFn: updatePosOpeningHours,
    onSuccess: (nextSettings) => {
      setOpeningHoursDraft(nextSettings.openingHours)
      void handleSaved("ບັນທຶກເວລາເປີດຮ້ານແລ້ວ")(nextSettings)
    },
    onError: handleSaveError,
  })
  const paymentsMutation = useMutation({
    mutationFn: updatePosPaymentSettings,
    onSuccess: handleSaved("ບັນທຶກການຊຳລະແລ້ວ"),
    onError: handleSaveError,
  })
  const tablesMutation = useMutation({
    mutationFn: updatePosTableSettings,
    onSuccess: handleSaved("ບັນທຶກຈຳນວນໂຕະແລ້ວ"),
    onError: handleSaveError,
  })
  const customersMutation = useMutation({
    mutationFn: updatePosCustomerSettings,
    onSuccess: handleSaved("ບັນທຶກການຕັ້ງຄ່າຄະແນນແລ້ວ"),
    onError: handleSaveError,
  })
  const printerMutation = useMutation({
    mutationFn: updatePosPrinterSettings,
    onSuccess: handleSaved("ບັນທຶກເຄື່ອງພິມແລ້ວ"),
    onError: handleSaveError,
  })
  const taxMutation = useMutation({
    mutationFn: updatePosTaxSettings,
    onSuccess: handleSaved("ບັນທຶກພາສີ / ຄ່າທຳນຽມແລ້ວ"),
    onError: handleSaveError,
  })
  const receiptInfoMutation = useMutation({
    mutationFn: async () => {
      if (!businessDraft.name.trim()) {
        throw new Error("Business name is required")
      }

      setLogoUploading(Boolean(selectedLogoFile))
      setQrUploading(Boolean(selectedQrFile))

      try {
        const logoUrl = selectedLogoFile
          ? (await uploadPosItemImage(selectedLogoFile)).url
          : businessDraft.logoUrl
        const qrImageUrl = selectedQrFile
          ? (await uploadPosItemImage(selectedQrFile)).url
          : receiptDraft.qrImageUrl
        const nextBusinessDraft = { ...businessDraft, logoUrl }
        const nextReceiptDraft = { ...receiptDraft, qrImageUrl }

        setBusinessDraft(nextBusinessDraft)
        setReceiptDraft(nextReceiptDraft)
        setSelectedLogoFile(null)
        setSelectedQrFile(null)

        await updatePosBusinessSettings(nextBusinessDraft)

        return updatePosReceiptSettings(nextReceiptDraft)
      } finally {
        setLogoUploading(false)
        setQrUploading(false)
      }
    },
    onSuccess: handleSaved("ບັນທຶກຂໍ້ມູນໃບບິນແລ້ວ"),
    onError: handleSaveError,
  })
  const appearanceMutation = useMutation({
    mutationFn: updatePosAppearanceSettings,
    onSuccess: handleSaved("ບັນທຶກໜ້າຕາແລ້ວ"),
    onError: handleSaveError,
  })
  const notificationsMutation = useMutation({
    mutationFn: updatePosNotificationSettings,
    onSuccess: handleSaved("ບັນທຶກການແຈ້ງເຕືອນແລ້ວ"),
    onError: handleSaveError,
  })
  const backupMutation = useMutation({
    mutationFn: runPosSettingsBackup,
    onSuccess: handleSaved("ສຳຮອງຂໍ້ມູນແລ້ວ"),
    onError: handleSaveError,
  })
  const saving =
    businessMutation.isPending ||
    hoursMutation.isPending ||
    tablesMutation.isPending ||
    customersMutation.isPending ||
    paymentsMutation.isPending ||
    printerMutation.isPending ||
    taxMutation.isPending ||
    receiptInfoMutation.isPending ||
    appearanceMutation.isPending ||
    notificationsMutation.isPending ||
    backupMutation.isPending

  function saveBusiness() {
    if (!businessDraft.name.trim()) {
      showPosToast({
        type: "warning",
        title: "ຂາດຊື່ຮ້ານ",
        description: "ຈຳເປັນຕ້ອງມີຊື່ຮ້ານ.",
      })
      return
    }

    businessMutation.mutate(businessDraft)
  }

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <SettingsTopbar />

          <div className="min-h-0 flex-1 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full min-h-0 flex-col rounded-2xl border border-[#eadfce] bg-white p-5 shadow-[0_18px_40px_rgba(80,54,27,0.1)]"
            >
              <div className="flex shrink-0 items-start justify-between gap-4">
                <div>
                  <h1 className="text-[30px] font-black tracking-tight text-[#3b2511]">
                    ຕັ້ງຄ່າ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                    {settings
                      ? `ກຳລັງຕັ້ງຄ່າ ${businessDraft.name || config.brandName}`
                      : "ກຳລັງໂຫຼດການຕັ້ງຄ່າ POS"}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm font-semibold text-[#8a7560]">
                  <span>ອັບເດດ: {settings ? formatDateTime(settings.updatedAt) : "-"}</span>
                  <button
                    type="button"
                    onClick={() => void settingsQuery.refetch()}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#eadfce] text-[#5a3718] transition hover:bg-[#fbf4ea]"
                    aria-label="ໂຫຼດການຕັ້ງຄ່າໃໝ່"
                  >
                    <RefreshCw className={cn("h-4 w-4", settingsQuery.isFetching && "animate-spin")} />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)] gap-5">
                <SettingsSideNav
                  sections={settingSections}
                  activeSectionId={activeSectionId}
                  onSelectSection={handleSelectSection}
                />

                <div className="min-h-0 overflow-y-auto pr-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-[#3b2511]">
                        {activeSectionLabel}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                        {sectionDescription(activeSectionId)}
                      </p>
                    </div>
                    {saving ? (
                      <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#fbf4ea] px-3 text-xs font-black text-[#8a5425]">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        ກຳລັງບັນທຶກ
                      </span>
                    ) : null}
                  </div>

                  {activeSectionId === "business" ? (
                    <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
                      <Panel title="ຂໍ້ມູນຮ້ານ" icon={Building2}>
                        <div className="grid grid-cols-2 gap-3">
                          <TextField
                            label="ຊື່ຮ້ານ"
                            value={businessDraft.name}
                            onChange={(name) => setBusinessDraft((current) => ({ ...current, name }))}
                          />
                          <TextField
                            label="ເບີໂທ"
                            value={businessDraft.phone}
                            onChange={(phone) => setBusinessDraft((current) => ({ ...current, phone }))}
                          />
                          <TextField
                            label="Email"
                            value={businessDraft.email}
                            onChange={(email) => setBusinessDraft((current) => ({ ...current, email }))}
                          />
                          <TextField
                            label="ປະເພດ"
                            value={businessDraft.type}
                            onChange={(type) => setBusinessDraft((current) => ({ ...current, type }))}
                            disabled
                          />
                          <TextArea
                            className="col-span-2"
                            label="ທີ່ຢູ່"
                            value={businessDraft.address}
                            onChange={(address) => setBusinessDraft((current) => ({ ...current, address }))}
                          />
                          <TextField
                            className="col-span-2"
                            label="ຮູບປົກ"
                            value={businessDraft.coverImageUrl}
                            onChange={(coverImageUrl) => setBusinessDraft((current) => ({ ...current, coverImageUrl }))}
                          />
                          <TextField
                            className="col-span-2"
                            label="Logo"
                            value={businessDraft.logoUrl}
                            onChange={(logoUrl) => setBusinessDraft((current) => ({ ...current, logoUrl }))}
                          />
                        </div>
                        <SaveButton
                          label="ບັນທຶກ"
                          loading={businessMutation.isPending}
                          onClick={saveBusiness}
                        />
                      </Panel>

                      <Panel title="ຫນ້າຕ່າງ" icon={Palette}>
                        <div className="overflow-hidden rounded-lg border border-[#eadfce]">
                          <img
                            src={businessDraft.coverImageUrl || "/images/pos-login-hero.png"}
                            alt={businessDraft.name}
                            className="h-40 w-full object-cover"
                          />
                          <div className="flex items-center gap-4 p-4">
                            <img
                              src={businessDraft.logoUrl || businessDraft.coverImageUrl || "/images/pos-login-hero.png"}
                              alt="Logo"
                              className="h-16 w-16 rounded-full object-cover ring-4 ring-[#fbf4ea]"
                            />
                            <div className="min-w-0">
                              <div className="truncate text-lg font-black text-[#3b2511]">
                                {businessDraft.name || "ຊື່ຮ້ານ"}
                              </div>
                              <div className="mt-1 text-sm font-semibold text-[#8a7560]">
                                {businessDraft.phone || "ຍັງບໍ່ມີເບີໂທ"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Panel>

                      <div className="col-span-2">
                        <Panel title="ເວລາເປີດຮ້ານ" icon={CalendarClock}>
                          <div className="overflow-hidden rounded-lg border border-[#eadfce]">
                            <div className="grid h-11 grid-cols-[140px_110px_1fr_1fr] items-center bg-[#fbf7ef] px-4 text-xs font-black uppercase text-[#7c6448]">
                              <span>ມື້</span>
                              <span>ເປີດ</span>
                              <span>ເລີ່ມ</span>
                              <span>ສິ້ນສຸດ</span>
                            </div>
                            {openingHoursDraft.map((hour) => (
                              <div
                                key={hour.id}
                                className="grid min-h-[58px] grid-cols-[140px_110px_1fr_1fr] items-center gap-3 border-t border-[#eadfce] px-4"
                              >
                                <span className="text-sm font-black text-[#3b2511]">
                                  {formatOpeningDay(hour)}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={hour.open}
                                  onChange={(event) =>
                                    setOpeningHoursDraft((current) =>
                                      current.map((item) =>
                                        item.id === hour.id ? { ...item, open: event.target.checked } : item,
                                      ),
                                    )
                                  }
                                  className="h-5 w-5 accent-[#5a3718]"
                                />
                                <input
                                  type="time"
                                  value={hour.start}
                                  disabled={!hour.open}
                                  onChange={(event) =>
                                    setOpeningHoursDraft((current) =>
                                      current.map((item) =>
                                        item.id === hour.id ? { ...item, start: event.target.value } : item,
                                      ),
                                    )
                                  }
                                  className="h-10 rounded-lg border border-[#eadfce] px-3 text-sm font-semibold text-[#3b2511] outline-none disabled:bg-[#f1eee9]"
                                />
                                <input
                                  type="time"
                                  value={hour.end}
                                  disabled={!hour.open}
                                  onChange={(event) =>
                                    setOpeningHoursDraft((current) =>
                                      current.map((item) =>
                                        item.id === hour.id ? { ...item, end: event.target.value } : item,
                                      ),
                                    )
                                  }
                                  className="h-10 rounded-lg border border-[#eadfce] px-3 text-sm font-semibold text-[#3b2511] outline-none disabled:bg-[#f1eee9]"
                                />
                              </div>
                            ))}
                          </div>
                          <SaveButton
                            label="ບັນທຶກ"
                            loading={hoursMutation.isPending}
                            onClick={() => hoursMutation.mutate(openingHoursDraft)}
                          />
                        </Panel>
                      </div>

                    </div>
                  ) : null}

                  {activeSectionId === "tables" ? (
                    <Panel title="ໂຕະ" icon={Home}>
                      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-4">
                        <NumberField
                          label="ຈຳນວນໂຕະ"
                          value={tableDraft.tableCount}
                          onChange={(tableCount) =>
                            setTableDraft({ tableCount: Math.max(1, Math.min(200, Math.round(tableCount || 1))) })
                          }
                        />
                        <div className="rounded-lg border border-[#eadfce] bg-[#fbf7ef] p-4">
                          <div className="text-xs font-black uppercase text-[#8a7560]">
                            ຕົວຢ່າງໃນໜ້າຂາຍ
                          </div>
                          <div className="mt-3 grid grid-cols-6 gap-2">
                            {Array.from({ length: Math.min(tableDraft.tableCount || 0, 24) }, (_, index) => (
                              <span
                                key={index}
                                className="flex h-9 items-center justify-center rounded-lg border border-[#ded4c8] bg-white text-xs font-black text-[#4f4032]"
                              >
                                ໂຕະ {String(index + 1).padStart(2, "0")}
                              </span>
                            ))}
                          </div>
                          {tableDraft.tableCount > 24 ? (
                            <p className="mt-3 text-xs font-bold text-[#8a7560]">
                              ສະແດງຕົວຢ່າງ 24 ໂຕະທຳອິດ.
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={tablesMutation.isPending}
                        onClick={() => tablesMutation.mutate(tableDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "customers" ? (
                    <Panel title="ລູກຄ້າ / ຄະແນນ" icon={Gift}>
                      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-4">
                        <div className="grid grid-cols-2 gap-3">
                          <ToggleCard
                            title="ເປີດໃຊ້ລູກຄ້າສະມາຊິກ"
                            description="ຖ້າປິດ ແຄດເຊຍຈະບໍ່ເຫັນເມນູລູກຄ້າ ແລະປຸ່ມສະມາຊິກ."
                            checked={customerDraft.enabled}
                            onChange={(enabled) =>
                              setCustomerDraft((current) => ({ ...current, enabled }))
                            }
                          />
                          <TextField
                            label="ລະຫັດ"
                            value={customerDraft.codePrefix}
                            onChange={(codePrefix) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                codePrefix: normalizeCustomerCodePrefixInput(codePrefix),
                              }))
                            }
                          />
                          <MoneyNumberField
                            label="ຍອດຊື້ຕໍ່ 1 ຄະແນນ"
                            value={customerDraft.earnAmount}
                            onChange={(earnAmount) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                earnAmount: Math.max(0, Math.round(earnAmount || 0)),
                              }))
                            }
                          />
                          <MoneyNumberField
                            label="ມູນຄ່າ 1 ຄະແນນ"
                            value={customerDraft.pointValue}
                            onChange={(pointValue) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                pointValue: Math.max(0, Math.round(pointValue || 0)),
                              }))
                            }
                          />
                          <NumberField
                            label="ໃຊ້ຄະແນນສູງສຸດ (%)"
                            value={customerDraft.maxRedeemRate}
                            min={0}
                            max={100}
                            onChange={(maxRedeemRate) =>
                              setCustomerDraft((current) => ({
                                ...current,
                                maxRedeemRate: Math.max(0, Math.min(100, maxRedeemRate || 0)),
                              }))
                            }
                          />
                        </div>

                        <div className="rounded-lg border border-[#eadfce] bg-[#fbf7ef] p-4">
                          <div className="text-xs font-black uppercase text-[#8a7560]">
                            ຕົວຢ່າງການຄິດຄະແນນ
                          </div>
                          <div className="mt-3 space-y-2 text-sm font-bold text-[#4f4032]">
                            <div className="flex justify-between gap-3">
                              <span>ລະຫັດລູກຄ້າໃໝ່</span>
                              <span>{customerDraft.codePrefix || "CM"}0001</span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span>ໄດ້ 1 ຄະແນນເມື່ອຊື້</span>
                              <span>{formatNumber(customerDraft.earnAmount)}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span>1 ຄະແນນຫຼຸດໄດ້</span>
                              <span>{formatNumber(customerDraft.pointValue)}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span>ໃຊ້ສູງສຸດຕໍ່ບິນ</span>
                              <span>{customerDraft.maxRedeemRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={customersMutation.isPending}
                        onClick={() => customersMutation.mutate(customerDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "payments" ? (
                    <Panel title="ວິທີຊຳລະ" icon={CreditCard}>
                      <div className="space-y-3">
                        {paymentsDraft.map((payment) => (
                          <div
                            key={payment.id}
                            className="grid grid-cols-[180px_minmax(0,1fr)_130px] items-center gap-3 rounded-lg border border-[#eadfce] p-3"
                          >
                            <Toggle
                              label={payment.label}
                              checked={payment.enabled}
                              onChange={(enabled) =>
                                setPaymentsDraft((current) =>
                                  current.map((item) =>
                                    item.id === payment.id ? { ...item, enabled } : item,
                                  ),
                                )
                              }
                            />
                            <input
                              value={payment.note}
                              onChange={(event) =>
                                setPaymentsDraft((current) =>
                                  current.map((item) =>
                                    item.id === payment.id ? { ...item, note: event.target.value } : item,
                                  ),
                                )
                              }
                              className="h-10 rounded-lg border border-[#eadfce] px-3 text-sm font-semibold text-[#3b2511] outline-none focus:border-[#b98b56]"
                            />
                            <span className={cn(
                              "rounded-lg px-3 py-2 text-center text-xs font-black",
                              payment.enabled ? "bg-[#e8f7e4] text-[#2d8a33]" : "bg-[#f1eee9] text-[#7b7067]",
                            )}>
                              {payment.enabled ? "ເປີດຢູ່" : "ປິດຢູ່"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={paymentsMutation.isPending}
                        onClick={() => paymentsMutation.mutate(paymentsDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "printers" ? (
                    <Panel title="ເຄື່ອງພິມ" icon={Printer}>
                      <div className="grid grid-cols-2 gap-3">
                        <TextField
                          label="ເຄື່ອງພິມໃບບິນ"
                          value={printerDraft.receiptPrinter}
                          onChange={(receiptPrinter) => setPrinterDraft((current) => ({ ...current, receiptPrinter }))}
                        />
                        <TextField
                          label="ເຄື່ອງພິມຄົວ/bar"
                          value={printerDraft.kitchenPrinter}
                          onChange={(kitchenPrinter) => setPrinterDraft((current) => ({ ...current, kitchenPrinter }))}
                        />
                        <ToggleCard
                          title="ພິມໃບບິນອັດຕະໂນມັດ"
                          description="ຫຼັງຈາກຊຳລະສຳເລັດ"
                          checked={printerDraft.autoPrintReceipt}
                          onChange={(autoPrintReceipt) => setPrinterDraft((current) => ({ ...current, autoPrintReceipt }))}
                        />
                        <ToggleCard
                          title="ພິມຄົວ/bar ອັດຕະໂນມັດ"
                          description="ເມື່ອສົ່ງລາຍການໄປພື້ນທີ່ຈັດການ"
                          checked={printerDraft.autoPrintKitchen}
                          onChange={(autoPrintKitchen) => setPrinterDraft((current) => ({ ...current, autoPrintKitchen }))}
                        />
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={printerMutation.isPending}
                        onClick={() => printerMutation.mutate(printerDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "invoices" ? (
                    <Panel title="ໃບບິນ" icon={ReceiptText}>
                      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
                        <div className="space-y-5">
                          <section>
                            <h3 className="mb-3 text-sm font-black text-[#3b2511]">
                              ຂໍ້ມູນ
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <TextField
                                label="ຊື່ຮ້ານໃນໃບບິນ"
                                value={businessDraft.name}
                                onChange={(name) => setBusinessDraft((current) => ({ ...current, name }))}
                              />
                              <TextField
                                label="ເບີໂທ"
                                value={businessDraft.phone}
                                onChange={(phone) => setBusinessDraft((current) => ({ ...current, phone }))}
                              />
                              <TextField
                                label="ຄຳນຳໜ້າເລກໃບບິນ"
                                value={receiptDraft.prefix}
                                onChange={(prefix) => setReceiptDraft((current) => ({ ...current, prefix }))}
                              />
                              <SelectField
                                label="ຂະໜາດໃບບິນ"
                                value={receiptDraft.paperSize}
                                onChange={(paperSize) =>
                                  setReceiptDraft((current) => ({
                                    ...current,
                                    paperSize: paperSize as PosReceiptSetting["paperSize"],
                                  }))
                                }
                                options={[
                                  ["80mm", "80mm"],
                                  ["58mm", "58mm"],
                                ]}
                              />
                              <TextArea
                                label="ທີ່ຢູ່ໃນໃບບິນ"
                                value={businessDraft.address}
                                onChange={(address) => setBusinessDraft((current) => ({ ...current, address }))}
                              />
                              <TextArea
                                label="ຂໍ້ຄວາມທ້າຍໃບບິນ"
                                value={receiptDraft.footer}
                                onChange={(footer) => setReceiptDraft((current) => ({ ...current, footer }))}
                              />
                              <LogoImageField
                                image={businessDraft.logoUrl}
                                name={businessDraft.name}
                                uploading={logoUploading}
                                onClear={() => {
                                  setSelectedLogoFile(null)
                                  setBusinessDraft((current) => ({ ...current, logoUrl: "" }))
                                }}
                                onFileSelect={handleLogoFile}
                              />
                              <LogoImageField
                                image={receiptDraft.qrImageUrl}
                                name="QR"
                                label="QR"
                                title="ອັບໂຫຼດ QR"
                                deleteLabel="ລຶບ QR"
                                ariaLabel="ປ່ຽນ QR"
                                uploading={qrUploading}
                                onClear={() => {
                                  setSelectedQrFile(null)
                                  setReceiptDraft((current) => ({
                                    ...current,
                                    qrImageUrl: "",
                                    showQr: false,
                                  }))
                                }}
                                onFileSelect={handleQrFile}
                              />
                            </div>
                          </section>

                          <section>
                            <h3 className="mb-3 text-sm font-black text-[#3b2511]">
                              ເປີດຟັງຊັນ
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <ToggleCard
                                title="ສະແດງ QR"
                                description="ພິມ QR ໃນໃບບິນເມື່ອມີຮູບ"
                                checked={receiptDraft.showQr}
                                onChange={(showQr) => setReceiptDraft((current) => ({ ...current, showQr }))}
                              />
                              <ToggleCard
                                title="ສະແດງ logo"
                                description="ພິມ logo ຢູ່ຫົວໃບບິນ"
                                checked={receiptDraft.showLogo}
                                onChange={(showLogo) => setReceiptDraft((current) => ({ ...current, showLogo }))}
                              />
                              <ToggleCard
                                title="ສະແດງພາສີ"
                                description="ແຍກແຖວ VAT/ຄ່າທຳນຽມໃນໃບບິນ"
                                checked={receiptDraft.showTax}
                                onChange={(showTax) => setReceiptDraft((current) => ({ ...current, showTax }))}
                              />
                            </div>
                          </section>
                        </div>

                        <ReceiptPreview
                          business={businessDraft}
                          receipt={receiptDraft}
                          tax={taxDraft}
                        />
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={receiptInfoMutation.isPending}
                        onClick={() => receiptInfoMutation.mutate()}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "taxes" ? (
                    <Panel title="ພາສີ / ຄ່າທຳນຽມ" icon={Percent}>
                      <div className="grid grid-cols-3 gap-3">
                        <NumberField
                          label="VAT (%)"
                          value={taxDraft.vatRate}
                          onChange={(vatRate) => setTaxDraft((current) => ({ ...current, vatRate }))}
                        />
                        <NumberField
                          label="ຄ່າບໍລິການ (%)"
                          value={taxDraft.serviceFeeRate}
                          onChange={(serviceFeeRate) => setTaxDraft((current) => ({ ...current, serviceFeeRate }))}
                        />
                        <SelectField
                          label="ປັດເງິນ"
                          value={taxDraft.roundingMode}
                          onChange={(roundingMode) =>
                            setTaxDraft((current) => ({
                              ...current,
                              roundingMode: roundingMode as PosTaxSetting["roundingMode"],
                            }))
                          }
                          options={[
                            ["none", "ບໍ່ປັດ"],
                            ["nearest-500", "ໃກ້ສຸດ 500 ກີບ"],
                            ["nearest-1000", "ໃກ້ສຸດ 1,000 ກີບ"],
                          ]}
                        />
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={taxMutation.isPending}
                        onClick={() => taxMutation.mutate(taxDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "appearance" ? (
                    <Panel title="ໜ້າຕາ" icon={Palette}>
                      <div className="grid grid-cols-2 gap-3">
                        <SelectField
                          label="ໂໝດ"
                          value={appearanceDraft.themeMode}
                          onChange={(themeMode) =>
                            setAppearanceDraft((current) => ({
                              ...current,
                              themeMode: themeMode as PosAppearanceSetting["themeMode"],
                            }))
                          }
                          options={[
                            ["light", "ສະຫວ່າງ"],
                            ["dark", "ມືດ"],
                            ["system", "ຕາມລະບົບ"],
                          ]}
                        />
                        <label>
                          <span className="text-xs font-black uppercase text-[#7c6448]">ສີເນັ້ນ</span>
                          <div className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-[#eadfce] px-3">
                            <input
                              type="color"
                              value={appearanceDraft.accentColor}
                              onChange={(event) =>
                                setAppearanceDraft((current) => ({ ...current, accentColor: event.target.value }))
                              }
                              className="h-7 w-9 cursor-pointer border-0 bg-transparent p-0"
                            />
                            <input
                              value={appearanceDraft.accentColor}
                              onChange={(event) =>
                                setAppearanceDraft((current) => ({ ...current, accentColor: event.target.value }))
                              }
                              className="min-w-0 flex-1 text-sm font-black text-[#3b2511] outline-none"
                            />
                          </div>
                        </label>
                        <div className="col-span-2 rounded-lg border border-[#eadfce] p-4">
                          <div
                            className="flex h-24 items-center justify-center rounded-lg text-sm font-black text-white"
                            style={{ backgroundColor: appearanceDraft.accentColor }}
                          >
                            ຕົວຢ່າງສີເນັ້ນ
                          </div>
                        </div>
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={appearanceMutation.isPending}
                        onClick={() => appearanceMutation.mutate(appearanceDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "backup" ? (
                    <Panel title="ສຳຮອງຂໍ້ມູນ" icon={Database}>
                      <div className="grid grid-cols-[1fr_220px] gap-4">
                        <div className="rounded-lg border border-[#eadfce] bg-[#fbf7ef] p-5">
                          <div className="text-xs font-black uppercase text-[#8a7560]">
                            ສຳຮອງຫຼ້າສຸດ
                          </div>
                          <div className="mt-2 text-2xl font-black text-[#3b2511]">
                            {settings?.backup.lastBackupAt
                              ? formatDateTime(settings.backup.lastBackupAt)
                              : "ຍັງບໍ່ມີ"}
                          </div>
                          <p className="mt-3 text-sm font-semibold leading-6 text-[#5f4a35]">
                            ການດຳເນີນການນີ້ຈະບັນທຶກຈຸດສຳຮອງ ເພື່ອໃຫ້ທີມງານຮູ້ວ່າຂໍ້ມູນ
                            ໄດ້ຖືກກວດຫຼ້າສຸດເມື່ອໃດ.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => backupMutation.mutate()}
                          disabled={backupMutation.isPending}
                          className="flex h-full min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-[#eadfce] bg-white text-[#4b321a] transition hover:bg-[#fbf4ea] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {backupMutation.isPending ? (
                            <RefreshCw className="h-8 w-8 animate-spin" />
                          ) : (
                            <Database className="h-8 w-8" />
                          )}
                          <span className="mt-3 text-sm font-black">ສຳຮອງດຽວນີ້</span>
                        </button>
                      </div>
                    </Panel>
                  ) : null}

                  {activeSectionId === "notifications" ? (
                    <Panel title="ແຈ້ງເຕືອນ" icon={Bell}>
                      <div className="grid grid-cols-3 gap-3">
                        <ToggleCard
                          title="ແຈ້ງເຕືອນຄັງສິນຄ້າ"
                          description="ແຈ້ງເມື່ອວັດຖຸດິບໃກ້ໝົດ"
                          checked={notificationsDraft.stockAlerts}
                          onChange={(stockAlerts) => setNotificationsDraft((current) => ({ ...current, stockAlerts }))}
                        />
                        <ToggleCard
                          title="ແຈ້ງເຕືອນອໍເດີໃໝ່"
                          description="ສະແດງແຈ້ງເຕືອນເມື່ອມີອໍເດີໃໝ່"
                          checked={notificationsDraft.orderAlerts}
                          onChange={(orderAlerts) => setNotificationsDraft((current) => ({ ...current, orderAlerts }))}
                        />
                        <ToggleCard
                          title="Email ລາຍງານປະຈຳວັນ"
                          description="ສົ່ງສະຫຼຸບທ້າຍມື້"
                          checked={notificationsDraft.dailyReportEmail}
                          onChange={(dailyReportEmail) => setNotificationsDraft((current) => ({ ...current, dailyReportEmail }))}
                        />
                      </div>
                      <SaveButton
                        label="ບັນທຶກ"
                        loading={notificationsMutation.isPending}
                        onClick={() => notificationsMutation.mutate(notificationsDraft)}
                      />
                    </Panel>
                  ) : null}

                  {activeSectionId === "pos-accounts" ? <PosAccountsSettingsPanel /> : null}

                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  )
}

function SettingsSideNav({
  sections,
  activeSectionId,
  onSelectSection,
}: {
  sections: SettingSection[]
  activeSectionId: SettingSection["id"]
  onSelectSection: (sectionId: SettingSection["id"]) => void
}) {
  return (
    <aside className="h-full min-h-0 overflow-hidden rounded-xl border border-[#eadfce] bg-white p-3 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <nav className="pos-sidebar-scroll h-full min-h-0 space-y-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = sectionIcons[section.id]
          const active = activeSectionId === section.id

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-4 text-left text-sm font-black transition",
                active
                  ? "bg-[#f4eadc] text-[#4b321a] shadow-[0_8px_20px_rgba(80,54,27,0.08)]"
                  : "text-[#5f4a35] hover:bg-[#fbf4ea]",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {section.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fbf4ea] text-[#8a5425]">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-black text-[#3b2511]">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function SaveButton({
  label,
  loading,
  onClick,
}: {
  label: string
  loading: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#5a3718] px-4 text-sm font-black text-white transition hover:bg-[#4a2c13] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </button>
  )
}

function TextField({
  label,
  value,
  onChange,
  disabled = false,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <label className={className}>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-[#eadfce] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none transition focus:border-[#b98b56] disabled:bg-[#f1eee9] disabled:text-[#8a7560]"
      />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  className,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}) {
  return (
    <label className={className}>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-lg border border-[#eadfce] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none transition focus:border-[#b98b56]"
      />
    </label>
  )
}

function MoneyNumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value > 0 ? formatMoneyInput(value) : ""}
        onChange={(event) => onChange(parseMoneyInput(event.target.value))}
        onBlur={() => {
          if (value < 1) onChange(1)
        }}
        className="mt-2 h-11 w-full rounded-lg border border-[#eadfce] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none transition focus:border-[#b98b56]"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <label className={className}>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-[92px] w-full resize-none rounded-lg border border-[#eadfce] bg-white px-3 py-3 text-sm font-semibold leading-6 text-[#3b2511] outline-none transition focus:border-[#b98b56]"
      />
    </label>
  )
}

function LogoImageField({
  image,
  name,
  label = "Logo",
  title = "ອັບໂຫຼດ logo",
  deleteLabel = "ລຶບ logo",
  ariaLabel = "ປ່ຽນ logo",
  uploading,
  onClear,
  onFileSelect,
  className,
}: {
  image: string
  name: string
  label?: string
  title?: string
  deleteLabel?: string
  ariaLabel?: string
  uploading: boolean
  onClear: () => void
  onFileSelect: (file: File) => void
  className?: string
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className={className}>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <div className="mt-2 grid grid-cols-[132px_minmax(0,1fr)] gap-3">
        <div className="relative h-[132px] overflow-hidden rounded-lg border border-[#eadfce] bg-[#f5ede3]">
          {image ? (
            <img src={image} alt={name || "Logo"} className="h-full w-full object-cover" />
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
            aria-label={ariaLabel}
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
                onFileSelect(file)
              }

              event.target.value = ""
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between rounded-lg border border-[#eadfce] bg-[#fbf7ef] p-4">
          <div>
            <div className="text-sm font-black text-[#3b2511]">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="mt-3 flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-md border border-[#ffd2cb] bg-[#fff7f5] px-3 text-xs font-semibold text-[#d04433] transition hover:bg-[#fff0ed]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleteLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<[string, string]>
  onChange: (value: string) => void
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-lg border border-[#eadfce] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none transition focus:border-[#b98b56]"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[#5a3718]"
      />
      <span className="text-sm font-black text-[#3b2511]">{label}</span>
    </label>
  )
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "rounded-lg border p-4 text-left transition",
        checked
          ? "border-[#b8d9a9] bg-[#f1faed]"
          : "border-[#eadfce] bg-white hover:bg-[#fbf4ea]",
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-black text-[#3b2511]">{title}</span>
        <span
          className={cn(
            "flex h-6 w-11 items-center rounded-full p-0.5 transition",
            checked ? "bg-[#3d9a43]" : "bg-[#d8d0c6]",
          )}
        >
          <span
            className={cn(
              "h-5 w-5 rounded-full bg-white shadow transition",
              checked && "translate-x-5",
            )}
          />
        </span>
      </span>
      <span className="mt-2 block text-sm font-semibold leading-5 text-[#5f4a35]">
        {description}
      </span>
    </button>
  )
}

function ReceiptPreview({
  business,
  receipt,
  tax,
}: {
  business: PosSettingsBusiness
  receipt: PosReceiptSetting
  tax: PosTaxSetting
}) {
  const subtotal = 105_000
  const serviceFee = Math.round((subtotal * tax.serviceFeeRate) / 100)
  const vat = Math.round((subtotal * tax.vatRate) / 100)
  const total = subtotal + serviceFee + vat
  const invoiceNo = `${receipt.prefix || "POS"}-000128`
  const businessName = business.name.trim() || "TJ POS"
  const logoUrl = business.logoUrl || business.coverImageUrl || "/images/pos-login-hero.png"
  const receiptWidth = getReceiptPaperWidth(receipt.paperSize)

  return (
    <aside className="rounded-xl border border-[#eadfce] bg-[#fbf7ef] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-black uppercase text-[#8a7560]">ຕົວຢ່າງ</div>
          <div className="mt-1 text-lg font-black text-[#3b2511]">ໃບບິນ</div>
        </div>
        <ReceiptText className="h-5 w-5 text-[#8a5425]" />
      </div>

      <div
        className="mx-auto max-w-full rounded-lg border border-[#e4d7c7] bg-white px-5 py-4 font-sans text-[12px] leading-5 text-[#2f2419] shadow-[0_16px_30px_rgba(80,54,27,0.1)]"
        style={{ width: receiptWidth }}
      >
        <div className="text-center">
          {receipt.showLogo ? (
            <img
              src={logoUrl}
              alt=""
              className="mx-auto mb-2 h-12 w-12 rounded-full object-cover"
            />
          ) : null}
          <div className="font-sans text-[15px] font-black text-[#3b2511]">
            {businessName}
          </div>
          <div className="mt-1 font-sans text-[11px] text-[#7c6448]">
            {business.phone || "020 5555 0128"}
          </div>
          <div className="font-sans text-[11px] text-[#7c6448]">
            {business.address || "ວຽງຈັນ, ລາວ"}
          </div>
        </div>

        <div className="my-3 border-t border-dashed border-[#bfa98e]" />

        <div className="space-y-1">
          <ReceiptPreviewRow label="ເລກບິນ" value={invoiceNo} />
          <ReceiptPreviewRow label="ວັນທີ" value="09/07/2026 14:35" />
          <ReceiptPreviewRow label="ພະນັກງານ" value="ເຈົ້າຂອງຮ້ານ" />
        </div>

        <div className="my-3 border-t border-dashed border-[#bfa98e]" />

        <div className="space-y-2">
          <ReceiptPreviewItem
            name="ກາເຟດຳ"
            qty={2}
            total={40_000}
            note="ບໍ່ໃສ່ນ້ຳຕານ, ບໍ່ໃສ່ນ້ຳກ້ອນ"
          />
          <ReceiptPreviewItem name="ລາເຕ້" qty={1} total={35_000} note="ຫວານໜ້ອຍ" />
          <ReceiptPreviewItem name="ເຄັກຊີສ" qty={1} total={30_000} />
        </div>

        <div className="my-3 border-t border-dashed border-[#bfa98e]" />

        <div className="space-y-1">
          <ReceiptPreviewRow label="ລວມ" value={formatPreviewKip(subtotal)} />
          {receipt.showTax ? (
            <>
              <ReceiptPreviewRow
                label={`ຄ່າບໍລິການ ${tax.serviceFeeRate}%`}
                value={formatPreviewKip(serviceFee)}
              />
              <ReceiptPreviewRow
                label={`ອາກອນ ${tax.vatRate}%`}
                value={formatPreviewKip(vat)}
              />
            </>
          ) : null}
          <div className="flex items-center justify-between pt-2 text-[14px] font-black">
            <span>ລວມທັງໝົດ</span>
            <span>{formatPreviewKip(total)}</span>
          </div>
        </div>

        <div className="my-3 border-t border-dashed border-[#bfa98e]" />

        {receipt.showQr && receipt.qrImageUrl ? (
          <>
            <div className="text-center">
              <img
                src={receipt.qrImageUrl}
                alt="QR"
                className="mx-auto h-24 w-24 rounded-md border border-[#eadfce] object-cover p-1"
              />
              <div className="mt-1 font-sans text-[10px] font-semibold text-[#7c6448]">
                QR ຊຳລະເງິນ
              </div>
            </div>

            <div className="my-3 border-t border-dashed border-[#bfa98e]" />
          </>
        ) : null}

        <p className="whitespace-pre-line text-center font-sans text-[11px] font-semibold text-[#5f4a35]">
          {receipt.footer.trim() || "ຂອບໃຈທີ່ໃຊ້ບໍລິການ"}
        </p>
      </div>
    </aside>
  )
}

function getReceiptPaperWidth(paperSize: PosReceiptSetting["paperSize"]) {
  return paperSize === "58mm" ? 220 : 280
}

function ReceiptPreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-[#6f5a43]">{label}</span>
      <span className="shrink-0 font-semibold">{value}</span>
    </div>
  )
}

function ReceiptPreviewItem({
  name,
  qty,
  total,
  note,
}: {
  name: string
  qty: number
  total: number
  note?: string
}) {
  return (
    <div className="grid grid-cols-[1fr_32px_82px] gap-x-2 gap-y-0.5">
      <span className="truncate font-semibold">{name}</span>
      <span className="text-right">x{qty}</span>
      <span className="text-right">{formatPreviewKip(total)}</span>
      {note ? (
        <span className="col-span-3 truncate text-[11px] font-semibold text-[#7c6448]">
          ໝາຍເຫດ: {note}
        </span>
      ) : null}
    </div>
  )
}

function formatPreviewKip(value: number) {
  return formatKip(value)
}

function formatNumber(value: number) {
  return formatKipAmount(value)
}

function formatMoneyInput(value: number) {
  const numeric = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

  return numeric.toLocaleString("en-US")
}

function parseMoneyInput(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ""))

  return Number.isFinite(numeric) ? numeric : 0
}

function normalizeCustomerCodePrefixInput(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)
}

function sectionDescription(sectionId: SettingSection["id"]) {
  const descriptions: Record<SettingSection["id"], string> = {
    business: "ອັບເດດຊື່ຮ້ານ, ການຕິດຕໍ່, logo ແລະ ຮູບຫນ້າຕ່າງ.",
    tables: "ກຳນົດຈຳນວນໂຕະທີ່ໃຊ້ໃນໜ້າຂາຍ.",
    customers: "ກຳນົດການສະສົມ ແລະ ໃຊ້ຄະແນນລູກຄ້າ.",
    payments: "ເປີດ/ປິດວິທີຊຳລະທີ່ POS.",
    printers: "ຕັ້ງຄ່າເຄື່ອງພິມໃບບິນ ແລະ ຄົວ/bar.",
    invoices: "ຕັ້ງຄ່າຄຳນຳໜ້າເລກໃບບິນ ແລະ ຂໍ້ຄວາມທ້າຍບິນ.",
    taxes: "ຈັດການ VAT, ຄ່າບໍລິການ ແລະ ວິທີປັດເງິນ.",
    appearance: "ແກ້ໄຂໂໝດໜ້າຕາ ແລະ ສີເນັ້ນ.",
    backup: "ບັນທຶກການສຳຮອງຂໍ້ມູນຫຼ້າສຸດ.",
    notifications: "ເປີດ/ປິດການແຈ້ງເຕືອນການດຳເນີນງານ.",
    "pos-accounts": "ສ້າງ username ແລະ password ສຳລັບເຂົ້າໜ້າຂາຍ POS.",
  }

  return descriptions[sectionId]
}

function normalizeBusinessName(
  business: PosSettingsBusiness,
  brandName: string,
): PosSettingsBusiness {
  const name = business.name.trim()

  if (!name || name === "TJ Cafe Vientiane") {
    return { ...business, name: brandName }
  }

  return business
}

function getStoredActiveSettingSection(): SettingSection["id"] {
  const storedSectionId = window.localStorage.getItem(activeSettingSectionStorageKey)

  return storedSectionId && settingSectionIds.has(storedSectionId as SettingSection["id"])
    ? (storedSectionId as SettingSection["id"])
    : "business"
}

function formatOpeningDay(hour: PosOpeningHour) {
  const labelsById: Record<string, string> = {
    mon: "ວັນຈັນ",
    tue: "ວັນອັງຄານ",
    wed: "ວັນພຸດ",
    thu: "ວັນພະຫັດ",
    fri: "ວັນສຸກ",
    sat: "ວັນເສົາ",
    sun: "ວັນອາທິດ",
  }
  const labelsByName: Record<string, string> = {
    "Thứ 2": "ວັນຈັນ",
    "Thứ 3": "ວັນອັງຄານ",
    "Thứ 4": "ວັນພຸດ",
    "Thứ 5": "ວັນພະຫັດ",
    "Thứ 6": "ວັນສຸກ",
    "Thứ 7": "ວັນເສົາ",
    "Chủ nhật": "ວັນອາທິດ",
  }

  return labelsById[hour.id] ?? labelsByName[hour.day] ?? hour.day
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}
