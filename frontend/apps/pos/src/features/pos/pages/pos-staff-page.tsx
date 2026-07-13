import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, X } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

import {
  createPosStaff,
  deletePosStaff,
  listPosStaff,
  updatePosStaff,
} from "@/features/pos/api/pos-staff-api"
import type {
  PosStaffKpi,
  PosStaffMember,
  PosStaffStatus,
  SavePosStaffBody,
} from "@/features/pos/api/pos-staff-api"
import {
  PosConfirmDialog,
} from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { StaffTopbar } from "@/features/pos/components/staff/staff-topbar"
import { StaffHrPanel } from "@/features/pos/components/staff/staff-hr-panel"
import type { StaffHrTab } from "@/features/pos/components/staff/staff-hr-panel"
import {
  StaffDetailPanel,
  StaffFilters,
  StaffKpiCard,
  StaffTable,
} from "@/features/pos/components/staff/staff-widgets"

type StaffStatusFilter = "all" | PosStaffStatus
type StaffFormMode = "create" | "edit"
type StaffFormErrors = Partial<Record<keyof SavePosStaffBody | "form", string>>

const shiftTimeByShift: Record<string, string> = {
  "Ca sáng": "06:00 - 14:00",
  "Ca chiều": "14:00 - 22:00",
  "Ca tối": "22:00 - 06:00",
  "Linh hoạt": "ຕາມຕາຕະລາງທີ່ຈັດໄວ້",
}

const shiftOptions: Array<[string, string]> = [
  ["Ca sáng", "ກະເຊົ້າ"],
  ["Ca chiều", "ກະບ່າຍ"],
  ["Ca tối", "ກະກາງຄືນ"],
  ["Linh hoạt", "ຍືດຫຍຸ່ນ"],
]

const defaultStaffForm: SavePosStaffBody = {
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  canLogin: false,
  email: "",
  phone: "",
  role: "Thu ngân",
  shift: "Ca sáng",
  shiftTime: "06:00 - 14:00",
  status: "active",
  gender: "Khác",
  birthday: "",
  address: "",
  identityNumber: "",
  joinDate: new Date().toISOString().slice(0, 10),
  note: "-",
}
const emptyStaff: PosStaffMember[] = []
const emptyKpis: PosStaffKpi[] = []

export function PosStaffPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>("all")
  const [activeTab, setActiveTab] = useState<"people" | StaffHrTab>("people")
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [detailStaffId, setDetailStaffId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formMode, setFormMode] = useState<StaffFormMode>("create")
  const [formOpen, setFormOpen] = useState(false)
  const [formValue, setFormValue] = useState<SavePosStaffBody>(defaultStaffForm)
  const [formErrors, setFormErrors] = useState<StaffFormErrors>({})
  const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null)

  const staffQuery = useQuery({
    queryKey: ["pos-staff"],
    queryFn: () => listPosStaff(),
    refetchOnMount: "always",
  })
  const staff = staffQuery.data?.staff ?? emptyStaff
  const kpis = staffQuery.data?.kpis ?? emptyKpis
  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return staff.filter((member) => {
      const searchMatched =
        !keyword ||
        member.name.toLowerCase().includes(keyword) ||
        member.username.toLowerCase().includes(keyword) ||
        member.email.toLowerCase().includes(keyword) ||
        member.phone.toLowerCase().includes(keyword)
      const roleMatched = roleFilter === "all" || member.role === roleFilter
      const statusMatched = statusFilter === "all" || member.status === statusFilter

      return searchMatched && roleMatched && statusMatched
    })
  }, [roleFilter, search, staff, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize))
  const visibleStaff = useMemo(() => {
    const start = (page - 1) * pageSize

    return filteredStaff.slice(start, start + pageSize)
  }, [filteredStaff, page, pageSize])
  const selectedStaff =
    staff.find((member) => member.id === selectedStaffId) ?? staff[0] ?? null
  const detailStaff = staff.find((member) => member.id === detailStaffId) ?? null
  const deletingStaff = staff.find((member) => member.id === deleteStaffId) ?? null

  useEffect(() => {
    if (!selectedStaffId && staff[0]) {
      setSelectedStaffId(staff[0].id)
    }
  }, [selectedStaffId, staff])

  useEffect(() => {
    setPage(1)
  }, [roleFilter, search, statusFilter])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  const createMutation = useMutation({
    mutationFn: createPosStaff,
    onSuccess: async (createdStaff) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-staff"] })
      setSelectedStaffId(createdStaff.id)
      setFormOpen(false)
      showPosToast({
        type: "success",
        title: "ເພີ່ມພະນັກງານແລ້ວ",
        description: `${createdStaff.name} ຢູ່ໃນລາຍຊື່ພະນັກງານແລ້ວ.`,
      })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ staffId, body }: { staffId: string; body: SavePosStaffBody }) =>
      updatePosStaff(staffId, body),
    onSuccess: async (updatedStaff) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-staff"] })
      setSelectedStaffId(updatedStaff.id)
      setFormOpen(false)
      showPosToast({
        type: "success",
        title: "ອັບເດດພະນັກງານແລ້ວ",
        description: `ຂໍ້ມູນຂອງ ${updatedStaff.name} ຖືກບັນທຶກແລ້ວ.`,
      })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deletePosStaff,
    onSuccess: async (_, staffId) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-staff"] })
      if (selectedStaffId === staffId) {
        setSelectedStaffId(null)
      }
      setDeleteStaffId(null)
      showPosToast({
        type: "success",
        title: "ລຶບພະນັກງານແລ້ວ",
        description: "ພະນັກງານຖືກນຳອອກຈາກລາຍການສະແດງແລ້ວ.",
      })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບພະນັກງານໄດ້",
        description: "ກະລຸນາກວດ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const savingStaff = createMutation.isPending || updateMutation.isPending

  function openCreateForm() {
    setFormMode("create")
    setFormValue(defaultStaffForm)
    setFormErrors({})
    setFormOpen(true)
  }

  function openEditForm(staffId: string) {
    const member = staff.find((item) => item.id === staffId)

    if (!member) return

    setSelectedStaffId(member.id)
    setFormMode("edit")
    setFormValue(staffToForm(member))
    setFormErrors({})
    setFormOpen(true)
  }

  function handleSelectStaff(staffId: string) {
    setSelectedStaffId(staffId)
    setDetailStaffId(staffId)
  }

  async function handleSubmitStaff() {
    const body = normalizeFormValue(formValue)
    const nextErrors = validateStaffForm(body, formValue.confirmPassword?.trim() ?? "", formMode)

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors)
      return
    }

    setFormErrors({})

    try {
      if (formMode === "edit" && selectedStaff) {
        await updateMutation.mutateAsync({ staffId: selectedStaff.id, body })
        return
      }

      await createMutation.mutateAsync(body)
    } catch (error) {
      const apiErrors = mapStaffApiErrors(error)

      setFormErrors(apiErrors)

      if (apiErrors.form && Object.keys(apiErrors).length === 1) {
        showPosToast({
          type: "error",
          title: "ບໍ່ສາມາດບັນທຶກພະນັກງານໄດ້",
          description: apiErrors.form,
        })
      }
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#efe7dc] text-[#3b2511]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <StaffTopbar />

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
                    ພະນັກງານ
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#8a7560]">
                    ຈັດການຂໍ້ມູນ, ຕຳແໜ່ງ, ເວລາເຮັດວຽກ ແລະ ການຕິດຕໍ່ພະນັກງານ
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="flex h-12 cursor-pointer items-center gap-3 rounded-lg bg-[linear-gradient(135deg,#5a3718_0%,#3b2511_100%)] px-6 text-sm font-black text-white shadow-[0_12px_24px_rgba(75,50,26,0.22)] transition hover:brightness-110"
                  >
                    <Plus className="h-5 w-5" />
                    ເພີ່ມພະນັກງານ
                  </button>
                </div>
              </div>

              <div className="mt-5 flex shrink-0 gap-2 border-b border-[#eadfce] pb-3">
                {([
                  ["people", "ລາຍຊື່ພະນັກງານ"],
                  ["schedule", "ລາຍການກະ"],
                  ["attendance", "ຊ່ວງເວລາເຮັດວຽກ"],
                  ["leave", "ການພັກ"],
                ] as const).map(([tabId, label]) => (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setActiveTab(tabId)}
                    className={`h-9 rounded-md px-3 text-sm font-black transition ${
                      activeTab === tabId
                        ? "bg-[#5a3718] text-white"
                        : "text-[#6f5c49] hover:bg-[#fbf4ea]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className={`mt-5 grid shrink-0 grid-cols-4 gap-4 ${activeTab === "people" ? "" : "hidden"}`}>
                {kpis.map((kpi) => (
                  <StaffKpiCard key={kpi.id} kpi={kpi} />
                ))}
              </div>

              <div className={`mt-5 flex min-h-0 flex-1 flex-col ${activeTab === "people" ? "" : "hidden"}`}>
                <StaffFilters
                  search={search}
                  onSearchChange={setSearch}
                  role={roleFilter}
                  onRoleChange={setRoleFilter}
                  status={statusFilter}
                  onStatusChange={(value) => setStatusFilter(value as StaffStatusFilter)}
                />

                {staffQuery.isError ? (
                  <div className="mt-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 px-6 text-center">
                    <p className="text-sm font-black text-red-700">
                      ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະນັກງານຈາກ API ໄດ້.
                    </p>
                    <p className="mt-2 text-xs font-bold text-red-500">
                      ກວດ backend `/pos/staff`, ແລ້ວໂຫຼດໜ້ານີ້ໃໝ່.
                    </p>
                  </div>
                ) : staffQuery.isLoading ? (
                  <div className="mt-4 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#eadfce] text-sm font-bold text-[#8a7560]">
                    ກຳລັງໂຫຼດພະນັກງານ...
                  </div>
                ) : (
                  <StaffTable
                    staff={visibleStaff}
                    selectedStaffId={selectedStaff?.id ?? ""}
                    totalStaff={filteredStaff.length}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onSelectStaff={handleSelectStaff}
                    onEditStaff={openEditForm}
                    onDeleteStaff={setDeleteStaffId}
                    onPageChange={setPage}
                    onPageSizeChange={(nextPageSize) => {
                      setPageSize(nextPageSize)
                      setPage(1)
                    }}
                  />
                )}
              </div>

              {activeTab !== "people" ? <StaffHrPanel tab={activeTab} staff={staff} /> : null}
            </motion.section>
          </div>
        </section>
      </div>

      <StaffFormModal
        open={formOpen}
        mode={formMode}
        value={formValue}
        errors={formErrors}
        saving={savingStaff}
        onChange={setFormValue}
        onClearError={(field) => {
          setFormErrors((current) => {
            const next = { ...current }
            delete next[field]
            delete next.form
            return next
          })
        }}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitStaff}
      />

      <AnimatePresence>
        {detailStaff ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2a1c10]/45 p-5"
            onClick={() => setDetailStaffId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[720px]"
            >
              <StaffDetailPanel
                staff={detailStaff}
                onEdit={() => openEditForm(detailStaff.id)}
                onDelete={() => setDeleteStaffId(detailStaff.id)}
                onClose={() => setDetailStaffId(null)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <PosConfirmDialog
        open={Boolean(deletingStaff)}
        title="ລຶບພະນັກງານນີ້ບໍ?"
        description={
          deletingStaff
            ? `${deletingStaff.name} ຈະບໍ່ສະແດງໃນລາຍຊື່ພະນັກງານອີກ.`
            : ""
        }
        tone="danger"
        confirmLabel={deleteMutation.isPending ? "ກຳລັງລຶບ..." : "ລຶບພະນັກງານ"}
        cancelLabel="ເກັບໄວ້"
        onCancel={() => setDeleteStaffId(null)}
        onConfirm={() => {
          if (deletingStaff && !deleteMutation.isPending) {
            deleteMutation.mutate(deletingStaff.id)
          }
        }}
      />
    </main>
  )
}

function StaffFormModal({
  open,
  mode,
  value,
  errors,
  saving,
  onChange,
  onClearError,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: StaffFormMode
  value: SavePosStaffBody
  errors: StaffFormErrors
  saving: boolean
  onChange: (value: SavePosStaffBody) => void
  onClearError: (field: keyof StaffFormErrors) => void
  onClose: () => void
  onSubmit: () => void
}) {
  function update<K extends keyof SavePosStaffBody>(key: K, nextValue: SavePosStaffBody[K]) {
    onChange({ ...value, [key]: nextValue })
    onClearError(key)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[82] flex items-center justify-center bg-[#2a1c10]/45 p-5"
        >
          <motion.form
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit()
            }}
            className="flex max-h-[92vh] w-full max-w-[780px] flex-col overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-[0_24px_70px_rgba(36,22,10,0.28)]"
          >
            <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-[#eadfce] bg-[#fbf7ef] px-6">
              <div>
                <h2 className="text-xl font-black text-[#3b2511]">
                  {mode === "create" ? "ເພີ່ມພະນັກງານ" : "ອັບເດດພະນັກງານ"}
                </h2>
                <p className="mt-1 text-xs font-bold text-[#8a7560]">
                  ຂໍ້ມູນ, ການຕິດຕໍ່, ບົດບາດ ແລະ ກະເຮັດວຽກ
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#5f4a35] transition hover:bg-[#efe3d2]"
                aria-label="ປິດຟອມພະນັກງານ"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
              {errors.form ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {errors.form}
                </div>
              ) : null}

              <FormSection title="ຂໍ້ມູນພື້ນຖານ">
                <div className="grid grid-cols-3 gap-4">
                  <TextField label="ຊື່ ແລະ ນາມສະກຸນ" value={value.name} onChange={(next) => update("name", next)} error={errors.name} required />
                  <TextField label="ເບີໂທ" value={value.phone} onChange={(next) => update("phone", next)} error={errors.phone} />
                  <TextField label="Email" value={value.email} onChange={(next) => update("email", next)} error={errors.email} />
                </div>
              </FormSection>

              <FormSection title="ຂໍ້ມູນສ່ວນຕົວ">
                <div className="grid grid-cols-3 gap-4">
                  <SelectField
                    label="ເພດ"
                    value={value.gender}
                    onChange={(next) => update("gender", next)}
                    options={[["Khác", "ອື່ນໆ"], ["Nam", "ຊາຍ"], ["Nữ", "ຍິງ"]]}
                  />
                  <DateField label="ວັນເກີດ" value={value.birthday} onChange={(next) => update("birthday", next)} error={errors.birthday} />
                  <TextField label="ເລກບັດປະຈຳຕົວ" value={value.identityNumber} onChange={(next) => update("identityNumber", next)} error={errors.identityNumber} />
                </div>
              </FormSection>

              <FormSection title="ການຕິດຕໍ່">
                <TextAreaField label="ທີ່ຢູ່" value={value.address} onChange={(next) => update("address", next)} error={errors.address} />
              </FormSection>

              <FormSection title="ຕຳແໜ່ງວຽກ">
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="ຕຳແໜ່ງ"
                    value={value.role}
                    onChange={(next) => update("role", next)}
                    error={errors.role}
                    options={[
                      ["Chủ quán", "ເຈົ້າຂອງຮ້ານ"],
                      ["Quản lý", "ຜູ້ຈັດການ"],
                      ["Thu ngân", "ພະນັກງານເກັບເງິນ"],
                      ["Pha chế", "ພະນັກງານຊົງເຄື່ອງດື່ມ"],
                      ["Phục vụ", "ພະນັກງານບໍລິການ"],
                      ["Nhân viên chung", "ພະນັກງານທົ່ວໄປ"],
                      ["Kho", "ຄັງສິນຄ້າ"],
                    ]}
                  />
                </div>
              </FormSection>

              <FormSection title="ກະເຮັດວຽກ">
                <div className="grid grid-cols-3 gap-4">
                  <SelectField
                    label="ກະຫຼັກ"
                    value={value.shift}
                    onChange={(next) => {
                      onChange({
                        ...value,
                        shift: next,
                        shiftTime: shiftTimeByShift[next] ?? "",
                      })
                      onClearError("shift")
                    }}
                    error={errors.shift}
                    options={shiftOptions}
                  />
                  <ReadOnlyField
                    label="ເວລາເຮັດວຽກ"
                    value={value.shiftTime || shiftTimeByShift[value.shift] || ""}
                  />
                  <DateField label="ວັນທີເຂົ້າວຽກ" value={value.joinDate} onChange={(next) => update("joinDate", next)} error={errors.joinDate} />
                </div>
              </FormSection>

              <FormSection title="ສະຖານະ">
                <SelectField
                  label="ສະຖານະ"
                  value={value.status}
                  onChange={(next) => update("status", next as PosStaffStatus)}
                  error={errors.status}
                  options={[
                    ["active", "ກຳລັງເຮັດວຽກ"],
                    ["on-leave", "ພັກຊົ່ວຄາວ"],
                    ["inactive", "ອອກວຽກ"],
                  ]}
                />
              </FormSection>

              <FormSection title="ໝາຍເຫດ">
                <TextAreaField label="ໝາຍເຫດພາຍໃນ" value={value.note} onChange={(next) => update("note", next)} error={errors.note} />
              </FormSection>
            </div>

            <div className="grid h-[78px] shrink-0 grid-cols-2 gap-4 border-t border-[#eadfce] bg-white px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="h-12 cursor-pointer rounded-xl border border-[#eadfce] bg-white text-sm font-black text-[#5f4a35] transition hover:bg-[#fbf4ea]"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-12 cursor-pointer rounded-xl bg-[linear-gradient(135deg,#5a3718_0%,#3b2511_100%)] text-sm font-black text-white shadow-[0_14px_28px_rgba(75,50,26,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກພະນັກງານ"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
      <h3 className="text-sm font-black text-[#3b2511]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#8a7560]">{label}</span>
      <input
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm font-bold text-[#3b2511] outline-none transition disabled:bg-[#f3eee6] disabled:text-[#a49484] ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-[#eadfce] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
        }`}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#8a7560]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-24 w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm font-bold text-[#3b2511] outline-none transition ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-[#eadfce] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
        }`}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  )
}

function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#8a7560]">{label}</span>
      <input
        type="date"
        value={toDateInputValue(value)}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm font-bold text-[#3b2511] outline-none transition ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-[#eadfce] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
        }`}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#8a7560]">{label}</span>
      <div className="mt-2 flex h-11 w-full items-center rounded-lg border border-[#eadfce] bg-[#fbf7ef] px-3 text-sm font-black text-[#5f4a35]">
        {value}
      </div>
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  error,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  options: Array<[string, string]>
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#8a7560]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-11 w-full cursor-pointer rounded-lg border bg-white px-3 text-sm font-bold text-[#3b2511] outline-none transition ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-[#eadfce] focus:border-[#b98b56] focus:ring-4 focus:ring-[#f4dec2]"
        }`}
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
      {error ? <FieldError message={error} /> : null}
    </label>
  )
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-xs font-bold text-red-600">{message}</p>
}

function staffToForm(staff: PosStaffMember): SavePosStaffBody {
  return {
    name: staff.name,
    username: staff.username,
    password: "",
    confirmPassword: "",
    canLogin: false,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
    shift: staff.shift,
    shiftTime: getShiftTimeForShift(staff.shift),
    status: staff.status,
    gender: staff.gender,
    birthday: toDateInputValue(staff.birthday),
    address: staff.address,
    identityNumber: staff.identityNumber,
    joinDate: toDateInputValue(staff.joinDate),
    note: staff.note,
  }
}

function normalizeFormValue(value: SavePosStaffBody): SavePosStaffBody {
  const password = value.password?.trim()

  return {
    ...value,
    name: value.name.trim(),
    username: value.username.trim().toLowerCase(),
    password: password || undefined,
    confirmPassword: undefined,
    canLogin: false,
    email: value.email.trim(),
    phone: value.phone.trim(),
    shiftTime: getShiftTimeForShift(value.shift),
    birthday: toDateInputValue(value.birthday),
    address: value.address.trim(),
    identityNumber: value.identityNumber.trim(),
    joinDate: toDateInputValue(value.joinDate),
    note: value.note.trim() || "-",
  }
}

function validateStaffForm(
  value: SavePosStaffBody,
  confirmPassword: string,
  mode: StaffFormMode,
): StaffFormErrors {
  const errors: StaffFormErrors = {}

  if (!value.name) {
    errors.name = "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນພະນັກງານ."
  }

  if (!value.role) {
    errors.role = "ກະລຸນາເລືອກບົດບາດ."
  }

  if (!value.status) {
    errors.status = "ກະລຸນາເລືອກສະຖານະ."
  }

  if (value.canLogin) {
    if (!value.username) {
      errors.username = "ກະລຸນາປ້ອນ username ເພື່ອໃຫ້ພະນັກງານເຂົ້າ POS."
    }

    if (mode === "create" && !value.password) {
      errors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ."
    }

    if (value.password && value.password.length < 6) {
      errors.password = "ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວອັກສອນ."
    }

    if (value.password && value.password !== confirmPassword) {
      errors.confirmPassword = "ລະຫັດຜ່ານຢືນຢັນບໍ່ກົງກັນ."
    }
  }

  if (value.email && !value.email.includes("@")) {
    errors.email = "ຮູບແບບ Email ບໍ່ຖືກຕ້ອງ."
  }

  return errors
}

function mapStaffApiErrors(error: unknown): StaffFormErrors {
  const message = getApiErrorMessage(error)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("username")) {
    return { username: "Username ມີຢູ່ແລ້ວ ຫຼື ບໍ່ຖືກຕ້ອງ." }
  }

  if (lowerMessage.includes("email")) {
    return { email: "Email ມີຢູ່ແລ້ວ ຫຼື ບໍ່ຖືກຕ້ອງ." }
  }

  if (lowerMessage.includes("password")) {
    return { password: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ, ຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວອັກສອນ." }
  }

  if (lowerMessage.includes("name")) {
    return { name: "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນພະນັກງານ." }
  }

  return {
    form: message || "ບໍ່ສາມາດບັນທຶກພະນັກງານໄດ້. ກະລຸນາກວດຂໍ້ມູນອີກຄັ້ງ.",
  }
}

function getApiErrorMessage(error: unknown) {
  const responseData = (error as { response?: { data?: { message?: string | string[]; error?: string } } })
    .response?.data
  const message = responseData?.message

  if (Array.isArray(message)) {
    return message.join(" ")
  }

  return message || responseData?.error || ""
}

function getShiftTimeForShift(shift: string) {
  return shiftTimeByShift[shift] ?? ""
}

function toDateInputValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (!match) return value

  const [, day, month, year] = match

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}
