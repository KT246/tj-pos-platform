import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getBackendBaseUrl, platformTokenCookie, readResponseBody } from "@/lib/server-api"

export async function POST(request: Request) {
  const token = (await cookies()).get(platformTokenCookie)?.value
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const response = await fetch(`${getBackendBaseUrl()}/platform/pos-clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const data = await readResponseBody(response)

  return NextResponse.json(data ?? { message: "Empty backend response" }, { status: response.status })
}
