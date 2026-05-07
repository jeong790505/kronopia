"use client"

import { signIn } from "next-auth/react"

export default function NaverSignInButton() {
  return (
    <button
      onClick={() => signIn("naver", { callbackUrl: "/dashboard" })}
      className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-[#03C75A] text-white font-medium rounded-lg shadow-sm hover:bg-[#02B351] hover:shadow-md transition-all duration-150"
    >
      <span
        aria-hidden="true"
        className="w-5 h-5 flex items-center justify-center font-bold text-lg leading-none"
      >
        N
      </span>
      네이버 계정으로 계속하기
    </button>
  )
}
