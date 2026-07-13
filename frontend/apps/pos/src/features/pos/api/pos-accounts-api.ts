import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/http"

export type PosAccountStatus = "active" | "inactive"

export type PosAccount = {
  id: string
  username: string
  status: PosAccountStatus
  createdAt: string
  updatedAt: string
}

export type SavePosAccountBody = {
  username: string
  password?: string
  status?: PosAccountStatus
}

export function listPosAccounts() {
  return apiGet<{ accounts: PosAccount[] }>("/pos/settings/pos-accounts")
}

export function createPosAccount(body: SavePosAccountBody) {
  return apiPost<PosAccount, SavePosAccountBody>("/pos/settings/pos-accounts", body)
}

export function updatePosAccount(accountId: string, body: SavePosAccountBody) {
  return apiPatch<PosAccount, SavePosAccountBody>(
    `/pos/settings/pos-accounts/${accountId}`,
    body,
  )
}

export function deletePosAccount(accountId: string) {
  return apiDelete<{ id: string; deleted: true }>(
    `/pos/settings/pos-accounts/${accountId}`,
  )
}
