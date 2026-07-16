import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: 12_000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "x-business-slug": import.meta.env.VITE_POS_BUSINESS_SLUG || "tj-cafe-vientiane",
  },
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("tj_pos_access_token")
  const sessionBusinessSlug = window.localStorage.getItem("tj_pos_business_slug")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (sessionBusinessSlug) {
    config.headers["x-business-slug"] = sessionBusinessSlug
  }

  return config
})

export async function apiGet<T>(path: string) {
  const response = await api.get<T>(path)

  return response.data
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody) {
  const response = await api.post<TResponse>(path, body)

  return response.data
}

export async function apiPatch<TResponse, TBody>(path: string, body: TBody) {
  const response = await api.patch<TResponse>(path, body)

  return response.data
}

export async function apiDelete<TResponse>(path: string) {
  const response = await api.delete<TResponse>(path)

  return response.data
}
