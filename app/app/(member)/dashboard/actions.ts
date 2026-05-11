"use server"

import { auth } from "@/lib/auth"
import { updateProfileName } from "@/lib/supabase/profile"
import { revalidatePath } from "next/cache"

const NAME_REGEX = /^[가-힣a-zA-Z0-9 ]+$/
const MAX_LEN = 30

export async function updateNickname(formData: FormData): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: "인증이 필요합니다." }
  }

  const raw = formData.get("name")
  if (typeof raw !== "string") {
    return { error: "닉네임을 입력해 주세요." }
  }

  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    return { error: "닉네임을 입력해 주세요." }
  }
  if (trimmed.length > MAX_LEN) {
    return { error: `닉네임은 ${MAX_LEN}자 이하여야 합니다.` }
  }
  if (!NAME_REGEX.test(trimmed)) {
    return { error: "한글, 영문, 숫자, 공백만 사용할 수 있습니다." }
  }

  try {
    await updateProfileName(session.user.email, trimmed)
  } catch (err) {
    console.error("[updateNickname] DB 오류:", err)
    return { error: "저장 중 오류가 발생했습니다." }
  }

  revalidatePath("/dashboard")
  return {}
}
