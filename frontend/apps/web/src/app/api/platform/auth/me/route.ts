import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getBackendBaseUrl, platformTokenCookie, readResponseBody } from "@/lib/server-api"

export async function GET() {
  const token = (await cookies()).get(platformTokenCookie)?.value
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const response = await fetch(`${getBackendBaseUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  const data = await readResponseBody(response)

  if (!response.ok) {
    (await cookies()).delete(platformTokenCookie)
    return NextResponse.json(data ?? { message: "Unauthorized" }, { status: response.status })
  }

  const session = data as { permissions?: string[] }
  if (!session.permissions?.includes("platform:manage")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(data)
}
