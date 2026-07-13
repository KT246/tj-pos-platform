import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { SquarePen, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  createPosCustomer,
  deletePosCustomer,
  listPosCustomers,
  updatePosCustomer,
} from "@/features/pos/api/pos-customers-api"
import type {
  PosCafeCustomer,
  PosCustomerKpi,
  SavePosCustomerBody,
} from "@/features/pos/api/pos-customers-api"
import {
  CustomerFilters,
  CustomerKpiCard,
  CustomerProfilePanel,
  CustomerTable,
} from "@/features/pos/components/customers/customer-widgets"
import { PosConfirmDialog } from "@/features/pos/components/notifications/pos-notification-ui"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { PosTopbar } from "@/features/pos/components/pos-topbar"
import type { SearchForm } from "@/features/pos/pages/pos-home-page"
import { usePosStore } from "@/features/pos/stores/pos-store"

const searchSchema = z.object({
  q: z.string().max(80),
})

type CustomerFormMode = "create" | "edit"
type CustomerFormErrors = Partial<Record<keyof SavePosCustomerBody | "form", string>>

const defaultCustomerForm: SavePosCustomerBody = {
  name: "",
  phone: "",
  status: "active",
}
const emptyCustomers: PosCafeCustomer[] = []
const emptyKpis: PosCustomerKpi[] = []

export function PosCustomersPage() {
  const tableLabel = usePosStore((state) => state.tableLabel)
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<CustomerFormMode>("create")
  const [formValue, setFormValue] = useState<SavePosCustomerBody>(defaultCustomerForm)
  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({})
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null)
  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  })

  const customersQuery = useQuery({
    queryKey: ["pos-customers"],
    queryFn: () => listPosCustomers(),
    refetchOnMount: "always",
  })
  const customers = customersQuery.data?.customers ?? emptyCustomers
  const kpis = customersQuery.data?.kpis ?? emptyKpis
  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return customers.filter((customer) => {
      const searchMatched =
        !keyword ||
        customer.name.toLowerCase().includes(keyword) ||
        customer.phone.toLowerCase().includes(keyword) ||
        customer.code.toLowerCase().includes(keyword)
      return searchMatched
    })
  }, [customers, search])
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const visibleCustomers = useMemo(() => {
    const start = (page - 1) * pageSize

    return filteredCustomers.slice(start, start + pageSize)
  }, [filteredCustomers, page, pageSize])
  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ??
    filteredCustomers[0] ??
    customers[0] ??
    null
  const deletingCustomer = customers.find((customer) => customer.id === deleteCustomerId) ?? null

  useEffect(() => {
    if (!selectedCustomerId && customers[0]) {
      setSelectedCustomerId(customers[0].id)
    }
  }, [customers, selectedCustomerId])

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  const createMutation = useMutation({
    mutationFn: createPosCustomer,
    onSuccess: async (createdCustomer) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-customers"] })
      setSelectedCustomerId(createdCustomer.id)
      setFormOpen(false)
      showPosToast({
        type: "success",
        title: "ເພີ່ມລູກຄ້າແລ້ວ",
        description: `${createdCustomer.name} ຖືກເພີ່ມເຂົ້າລາຍຊື່ລູກຄ້າແລ້ວ.`,
      })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ customerId, body }: { customerId: string; body: SavePosCustomerBody }) =>
      updatePosCustomer(customerId, body),
    onSuccess: async (updatedCustomer) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-customers"] })
      setSelectedCustomerId(updatedCustomer.id)
      setFormOpen(false)
      showPosToast({
        type: "success",
        title: "ອັບເດດລູກຄ້າແລ້ວ",
        description: `ຂໍ້ມູນຂອງ ${updatedCustomer.name} ຖືກບັນທຶກແລ້ວ.`,
      })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deletePosCustomer,
    onSuccess: async (_, customerId) => {
      await queryClient.invalidateQueries({ queryKey: ["pos-customers"] })
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null)
      }
      setDeleteCustomerId(null)
      showPosToast({
        type: "success",
        title: "ລຶບລູກຄ້າແລ້ວ",
        description: "ລູກຄ້າຖືກນຳອອກຈາກລາຍຊື່ທີ່ສະແດງແລ້ວ.",
      })
    },
    onError: () => {
      showPosToast({
        type: "error",
        title: "ບໍ່ສາມາດລຶບລູກຄ້າໄດ້",
        description: "ກະລຸນາກວດສອບ backend ແລ້ວລອງໃໝ່.",
      })
    },
  })
  const savingCustomer = createMutation.isPending || updateMutation.isPending

  function openCreateForm() {
    setFormMode("create")
    setFormValue(defaultCustomerForm)
    setFormErrors({})
    setFormOpen(true)
  }

  function openEditForm(customerId: string) {
    const customer = customers.find((item) => item.id === customerId)

    if (!customer) return

    setSelectedCustomerId(customer.id)
    setFormMode("edit")
    setFormValue(customerToForm(customer))
    setFormErrors({})
    setFormOpen(true)
  }

  async function handleSubmitCustomer() {
    const body = normalizeCustomerFormValue(formValue)
    const nextErrors = validateCustomerForm(body)

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors)
      return
    }

    setFormErrors({})

    try {
      if (formMode === "edit" && selectedCustomer) {
        await updateMutation.mutateAsync({ customerId: selectedCustomer.id, body })
        return
      }

      await createMutation.mutateAsync(body)
    } catch (error) {
      const apiErrors = mapCustomerApiErrors(error)

      setFormErrors(apiErrors)

      if (apiErrors.form && Object.keys(apiErrors).length === 1) {
        showPosToast({
          type: "error",
          title: "ບໍ່ສາມາດບັນທຶກລູກຄ້າໄດ້",
          description: apiErrors.form,
        })
      }
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f3efe7] text-[#2f2419]">
      <div className="flex h-full min-w-[1280px]">
        <section className="flex min-w-0 flex-1 flex-col">
          <PosTopbar form={form} tableLabel={tableLabel} />

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_410px] gap-3 p-3">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 px-5 py-4">
                <div>
                  <h1 className="text-2xl font-black tracking-normal text-[#2f2419]">ລູກຄ້າ</h1>
                  <p className="mt-1 text-sm font-semibold text-[#756656]">
                    ຈັດການຂໍ້ມູນລູກຄ້າ ແລະ ຄະແນນສະສົມຂອງຮ້ານ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2f2419] px-4 text-sm font-black text-white shadow-[0_8px_18px_rgba(47,36,25,0.18)] transition hover:bg-[#4a3726]"
                >
                  <SquarePen className="h-5 w-5" />
                  ເພີ່ມລູກຄ້າ
                </button>
              </div>

              <div className="grid shrink-0 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-px border-y border-[#ded4c8] bg-[#ded4c8]">
                {kpis.map((kpi) => (
                  <CustomerKpiCard key={kpi.id} kpi={kpi} />
                ))}
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <CustomerFilters
                  search={search}
                  onSearchChange={setSearch}
                />

                {customersQuery.isError ? (
                  <div className="m-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 px-6 text-center">
                    <p className="text-sm font-black text-red-700">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນລູກຄ້າຈາກ API ໄດ້.</p>
                    <p className="mt-2 text-xs font-bold text-red-500">ກວດສອບ backend `/pos/customers` ແລ້ວໂຫຼດໜ້າໃໝ່.</p>
                  </div>
                ) : customersQuery.isLoading ? (
                  <div className="m-4 flex min-h-0 flex-1 items-center justify-center rounded-lg border border-dashed border-[#ded4c8] text-sm font-bold text-[#756656]">
                    ກຳລັງໂຫຼດລູກຄ້າ...
                  </div>
                ) : (
                  <CustomerTable
                    customers={visibleCustomers}
                    selectedCustomerId={selectedCustomer?.id ?? ""}
                    totalCustomers={filteredCustomers.length}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onSelectCustomer={(customerId) => {
                      setSelectedCustomerId(customerId)
                      setFormOpen(false)
                    }}
                    onEditCustomer={openEditForm}
                    onDeleteCustomer={setDeleteCustomerId}
                    onPageChange={setPage}
                    onPageSizeChange={(nextPageSize) => {
                      setPageSize(nextPageSize)
                      setPage(1)
                    }}
                  />
                )}
              </div>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="h-full min-h-0"
            >
              {formOpen ? (
                <CustomerFormPanel
                  mode={formMode}
                  value={formValue}
                  errors={formErrors}
                  saving={savingCustomer}
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
                  onSubmit={handleSubmitCustomer}
                />
              ) : selectedCustomer ? (
                <CustomerProfilePanel
                  customer={selectedCustomer}
                  onEdit={() => openEditForm(selectedCustomer.id)}
                  onDelete={() => setDeleteCustomerId(selectedCustomer.id)}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#ded4c8] bg-white text-sm font-bold text-[#756656]">
                  ຍັງບໍ່ມີລູກຄ້າ
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      <PosConfirmDialog
        open={Boolean(deletingCustomer)}
        title="ລຶບລູກຄ້າບໍ?"
        description={
          deletingCustomer
            ? `${deletingCustomer.name} ຈະບໍ່ສະແດງໃນລາຍຊື່ລູກຄ້າອີກ.`
            : ""
        }
        tone="danger"
        confirmLabel={deleteMutation.isPending ? "ກຳລັງລຶບ..." : "ລຶບລູກຄ້າ"}
        cancelLabel="ເກັບໄວ້"
        onCancel={() => setDeleteCustomerId(null)}
        onConfirm={() => {
          if (deletingCustomer && !deleteMutation.isPending) {
            deleteMutation.mutate(deletingCustomer.id)
          }
        }}
      />
    </main>
  )
}

function CustomerFormPanel({
  mode,
  value,
  errors,
  saving,
  onChange,
  onClearError,
  onClose,
  onSubmit,
}: {
  mode: CustomerFormMode
  value: SavePosCustomerBody
  errors: CustomerFormErrors
  saving: boolean
  onChange: (value: SavePosCustomerBody) => void
  onClearError: (field: keyof CustomerFormErrors) => void
  onClose: () => void
  onSubmit: () => void
}) {
  function update<K extends keyof SavePosCustomerBody>(key: K, nextValue: SavePosCustomerBody[K]) {
    onChange({ ...value, [key]: nextValue })
    onClearError(key)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#ded4c8] bg-white shadow-[0_12px_28px_rgba(52,40,28,0.08)]"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#ded4c8] bg-white px-5">
        <h2 className="text-base font-black text-[#2f2419]">
          {mode === "create" ? "ເພີ່ມລູກຄ້າ" : "ແກ້ໄຂລູກຄ້າ"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#4f4032] transition hover:bg-[#f7f1e9]"
          aria-label="ປິດຟອມລູກຄ້າ"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {errors.form ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {errors.form}
          </div>
        ) : null}

        <div className="space-y-4">
          <TextField
            label="ຊື່ລູກຄ້າ"
            value={value.name}
            onChange={(next) => update("name", next)}
            error={errors.name}
            required
          />
          <TextField
            label="ເບີໂທ"
            value={value.phone}
            onChange={(next) => update("phone", next)}
            error={errors.phone}
          />
        </div>
      </div>

      <div className="grid h-[72px] shrink-0 grid-cols-2 gap-4 border-t border-[#ded4c8] bg-white px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 cursor-pointer rounded-lg border border-[#ded4c8] bg-white text-sm font-black text-[#4f4032] transition hover:bg-[#f7f1e9]"
        >
          ຍົກເລີກ
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-11 cursor-pointer rounded-lg bg-[#2f2419] text-sm font-black text-white shadow-[0_10px_22px_rgba(47,36,25,0.18)] transition hover:bg-[#4a3726] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
        </button>
      </div>
    </form>
  )
}

function TextField({
  label,
  value,
  onChange,
  error,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-[#756656]">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm font-bold text-[#2f2419] outline-none transition ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-[#ded4c8] focus:border-[#a97743] focus:ring-3 focus:ring-[#ead7bf]"
        }`}
      />
      {error ? <FieldError message={error} /> : null}
    </label>
  )
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-xs font-bold text-red-600">{message}</p>
}

function customerToForm(customer: PosCafeCustomer): SavePosCustomerBody {
  return {
    name: customer.name,
    phone: customer.phone,
    status: customer.status,
  }
}

function normalizeCustomerFormValue(value: SavePosCustomerBody): SavePosCustomerBody {
  return {
    ...value,
    name: value.name.trim(),
    phone: value.phone.trim(),
  }
}

function validateCustomerForm(value: SavePosCustomerBody): CustomerFormErrors {
  const errors: CustomerFormErrors = {}

  if (!value.name) {
    errors.name = "ກະລຸນາໃສ່ຊື່ລູກຄ້າ."
  }

  return errors
}

function mapCustomerApiErrors(error: unknown): CustomerFormErrors {
  const message = getApiErrorMessage(error)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("phone")) {
    return { phone: "ເບີໂທນີ້ມີຢູ່ແລ້ວ ຫຼື ບໍ່ຖືກຕ້ອງ." }
  }

  if (lowerMessage.includes("name")) {
    return { name: "ກະລຸນາໃສ່ຊື່ລູກຄ້າ." }
  }

  return {
    form: message || "ບໍ່ສາມາດບັນທຶກລູກຄ້າໄດ້. ກະລຸນາກວດຂໍ້ມູນອີກຄັ້ງ.",
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
