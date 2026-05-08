"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

const ERROR_MESSAGES: Record<string, string> = {
  OAuthCallbackError: "로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
  AccessDenied: "접근이 거부되었습니다.",
  OAuthAccountNotLinked:
    "이미 다른 방법으로 가입된 이메일입니다. 기존 로그인 방법을 사용해 주세요.",
  AccountNotLinked:
    "이미 다른 방법으로 가입된 이메일입니다. 기존 로그인 방법을 사용해 주세요.",
  Verification: "인증 링크가 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.",
  MissingCSRF:
    "보안 토큰이 누락되었습니다. 페이지를 새로고침 후 다시 시도해 주세요.",
}

const FALLBACK = "로그인 중 알 수 없는 오류가 발생했습니다. 다시 시도해 주세요."

export default function LoginErrorBanner() {
  const params = useSearchParams()
  const error = params.get("error")
  const [dismissed, setDismissed] = useState(false)

  if (!error || dismissed) return null

  const message = ERROR_MESSAGES[error] ?? FALLBACK

  return (
    <div
      role="alert"
      className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="에러 메시지 닫기"
        className="text-red-400 hover:text-red-600 leading-none text-base"
      >
        ✕
      </button>
    </div>
  )
}
