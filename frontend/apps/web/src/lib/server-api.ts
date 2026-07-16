export const platformTokenCookie = "tj_platform_access_token"

export function getBackendBaseUrl() {
  return (process.env.API_BASE_URL || "http://localhost:3001").replace(/\/$/, "")
}

export async function readResponseBody(response: Response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}
