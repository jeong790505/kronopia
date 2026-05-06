import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const isMember = req.nextUrl.pathname.startsWith("/dashboard")
  if (isMember && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = { matcher: ["/dashboard/:path*"] }
