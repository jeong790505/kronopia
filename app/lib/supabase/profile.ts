import { getAdminClient } from "./admin"

export type Profile = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  provider: string
  created_at: string
  updated_at: string
}

/**
 * email로 단일 프로필 조회.
 * 없으면 null 반환, DB 오류 시 throw.
 */
export async function getProfile(email: string): Promise<Profile | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (error) throw new Error(`getProfile failed: ${error.message}`)
  return data as Profile | null
}

/**
 * 프로필 upsert. 신규 행은 OAuth provider name을 사용하지만, 기존 행은
 * name 컬럼을 보존(사용자가 편집한 닉네임을 매 로그인마다 덮어쓰지 않음).
 * 실패 시 throw.
 */
export async function upsertProfile(input: {
  email: string
  name?: string | null
  avatar_url?: string | null
  provider: string
}): Promise<Profile> {
  const supabase = getAdminClient()

  const { data: existing, error: selectErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", input.email)
    .maybeSingle()
  if (selectErr) throw new Error(`upsertProfile select failed: ${selectErr.message}`)

  if (existing) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: input.avatar_url ?? null,
        provider: input.provider,
        updated_at: new Date().toISOString(),
      })
      .eq("email", input.email)
      .select()
      .single()
    if (error) throw new Error(`upsertProfile update failed: ${error.message}`)
    return data as Profile
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      email: input.email,
      name: input.name ?? null,
      avatar_url: input.avatar_url ?? null,
      provider: input.provider,
    })
    .select()
    .single()
  if (error) throw new Error(`upsertProfile insert failed: ${error.message}`)
  return data as Profile
}

/**
 * 사용자 닉네임 갱신. 실패 시 throw.
 */
export async function updateProfileName(email: string, name: string): Promise<Profile> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({
      name,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select()
    .single()
  if (error) throw new Error(`updateProfileName failed: ${error.message}`)
  return data as Profile
}
