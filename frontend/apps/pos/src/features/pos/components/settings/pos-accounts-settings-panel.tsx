import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KeyRound, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react"
import { useState } from "react"

import {
  createPosAccount,
  deletePosAccount,
  listPosAccounts,
  updatePosAccount,
} from "@/features/pos/api/pos-accounts-api"
import type {
  PosAccount,
} from "@/features/pos/api/pos-accounts-api"
import { showPosToast } from "@/features/pos/components/notifications/pos-toast-store"
import { cn } from "@/lib/utils"

type AccountForm = {
  username: string
  password: string
}

const emptyForm: AccountForm = { username: "", password: "" }

export function PosAccountsSettingsPanel() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<PosAccount | null>(null)
  const [form, setForm] = useState<AccountForm>(emptyForm)
  const [formError, setFormError] = useState("")

  const accountsQuery = useQuery({
    queryKey: ["pos-accounts"],
    queryFn: listPosAccounts,
  })
  const accounts = accountsQuery.data?.accounts ?? []

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        username: form.username.trim().toLowerCase(),
        ...(form.password ? { password: form.password } : {}),
        ...(editingAccount ? { status: editingAccount.status } : {}),
      }

      return editingAccount
        ? updatePosAccount(editingAccount.id, body)
        : createPosAccount(body)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pos-accounts"] })
      setEditingAccount(null)
      setForm(emptyForm)
      setFormOpen(false)
      showPosToast({
        type: "success",
        title: editingAccount ? "ແກ້ໄຂບັນຊີ POS ສຳເລັດ" : "ເພີ່ມບັນຊີ POS ສຳເລັດ",
        description: "ບັນຊີສາມາດໃຊ້ເຂົ້າໜ້າຂາຍໄດ້ແລ້ວ.",
      })
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "ບໍ່ສາມາດບັນທຶກບັນຊີ POS ໄດ້"
      setFormError(message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePosAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pos-accounts"] })
      showPosToast({
        type: "success",
        title: "ປິດບັນຊີ POS ສຳເລັດ",
        description: "ບັນຊີນີ້ຈະບໍ່ສາມາດເຂົ້າຂາຍໄດ້.",
      })
    },
  })

  function openCreate() {
    setFormOpen(true)
    setEditingAccount(null)
    setForm(emptyForm)
    setFormError("")
  }

  function openEdit(account: PosAccount) {
    setFormOpen(true)
    setEditingAccount(account)
    setForm({ username: account.username, password: "" })
    setFormError("")
  }

  function submitForm() {
    const username = form.username.trim()

    if (username.length < 3) {
      setFormError("Username ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ.")
      return
    }

    if (!editingAccount && form.password.length < 6) {
      setFormError("Password ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ.")
      return
    }

    if (editingAccount && form.password && form.password.length < 6) {
      setFormError("Password ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ.")
      return
    }

    setFormError("")
    saveMutation.mutate()
  }

  function toggleStatus(account: PosAccount) {
    updatePosAccount(account.id, {
      username: account.username,
      status: account.status === "active" ? "inactive" : "active",
    })
      .then(() => queryClient.invalidateQueries({ queryKey: ["pos-accounts"] }))
      .catch(() => {
        showPosToast({
          type: "error",
          title: "ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
          description: "ກະລຸນາລອງໃໝ່.",
        })
      })
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fbf4ea] text-[#8a5425]">
                <KeyRound className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-[#3b2511]">ບັນຊີຂາຍ POS</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#7c6448]">
              ສ້າງ username ແລະ password ສຳລັບເຂົ້າໜ້າຂາຍ. ບັນຊີທັງໝົດໃຊ້ເມນູຂາຍດຽວກັນ.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#5a3718] px-3 text-sm font-black text-white transition hover:bg-[#4a2c13]"
          >
            <Plus className="h-4 w-4" />
            ເພີ່ມບັນຊີ
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-[#eadfce]">
          {accountsQuery.isLoading ? (
            <div className="flex h-24 items-center justify-center text-sm font-bold text-[#8a7560]">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ກຳລັງໂຫຼດ
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-8 text-center text-sm font-bold text-[#8a7560]">
              ຍັງບໍ່ມີບັນຊີຂາຍ POS
            </div>
          ) : (
            <div className="divide-y divide-[#eadfce]">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#3b2511]">{account.username}</p>
                    <p className="mt-1 text-xs font-semibold text-[#8a7560]">
                      {account.status === "active" ? "ກຳລັງໃຊ້ງານ" : "ປິດໃຊ້ງານ"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStatus(account)}
                      className={cn(
                        "h-9 rounded-md border px-3 text-xs font-black transition",
                        account.status === "active"
                          ? "border-[#eadfce] text-[#8a7560] hover:bg-[#fbf4ea]"
                          : "border-[#d8eadb] text-[#2f8748] hover:bg-[#eef9f0]",
                      )}
                    >
                      {account.status === "active" ? "ປິດ" : "ເປີດ"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(account)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#eadfce] text-[#5a3718] transition hover:bg-[#fbf4ea]"
                      aria-label="ແກ້ໄຂບັນຊີ"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(account.id)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#f0d8d4] text-[#c64b42] transition hover:bg-[#fff2ef]"
                      aria-label="ປິດບັນຊີ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {formOpen ? (
        <section className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-[0_14px_34px_rgba(80,54,27,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#3b2511]">
              {editingAccount ? "ແກ້ໄຂບັນຊີ" : "ເພີ່ມບັນຊີໃໝ່"}
            </h3>
            {formOpen ? (
              <button
                type="button"
                onClick={() => {
                  setEditingAccount(null)
                  setForm(emptyForm)
                  setFormError("")
                  setFormOpen(false)
                }}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[#8a7560] hover:bg-[#fbf4ea]"
                aria-label="ປິດ"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="mt-4 grid max-w-[680px] grid-cols-2 gap-3">
            <AccountField
              label="Username"
              value={form.username}
              onChange={(username) => setForm((current) => ({ ...current, username }))}
            />
            <AccountField
              label={editingAccount ? "Password mới (không bắt buộc)" : "Password"}
              type="password"
              value={form.password}
              onChange={(password) => setForm((current) => ({ ...current, password }))}
            />
          </div>
          {formError ? <p className="mt-3 text-sm font-bold text-[#c64b42]">{formError}</p> : null}
          <button
            type="button"
            onClick={submitForm}
            disabled={saveMutation.isPending}
            className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#5a3718] px-4 text-sm font-black text-white transition hover:bg-[#4a2c13] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            ບັນທຶກ
          </button>
        </section>
      ) : null}
    </div>
  )
}

function AccountField({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase text-[#7c6448]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="mt-1 h-10 w-full rounded-lg border border-[#dfd0bd] bg-white px-3 text-sm font-semibold text-[#3b2511] outline-none transition focus:border-[#8a5425] focus:ring-2 focus:ring-[#ead8c3]"
      />
    </label>
  )
}
