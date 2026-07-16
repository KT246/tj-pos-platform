import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getBackendBaseUrl, platformTokenCookie, readResponseBody } from "@/lib/server-api"

export async function POST(request: Request) {
  const body = await request.json()
  const response = await fetch(`${getBackendBaseUrl()}/auth/business/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const data = await readResponseBody(response)

  if (!response.ok) {
    return NextResponse.json(data ?? { message: "Login failed" }, { status: response.status })
  }

  const session = data as { accessToken?: string; permissions?: string[] }
  if (!session.accessToken || !session.permissions?.includes("platform:manage")) {
    return NextResponse.json({ message: "Platform admin access required" }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.set(platformTokenCookie, session.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.PLATFORM_COOKIE_SECURE !== "false",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return NextResponse.json({ ok: true })
}
