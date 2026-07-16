import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { platformTokenCookie } from "@/lib/server-api"

export async function POST() {
  (await cookies()).delete(platformTokenCookie)
  return NextResponse.json({ ok: true })
}
