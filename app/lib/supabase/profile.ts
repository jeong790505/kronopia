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
 * 프로필 upsert (email 충돌 시 update).
 * 삽입/갱신된 행을 반환. 실패 시 throw.
 */
export async function upsertProfile(input: {
  email: string
  name?: string | null
  avatar_url?: string | null
  provider: string
}): Promise<Profile> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        email: input.email,
        name: input.name ?? null,
        avatar_url: input.avatar_url ?? null,
        provider: input.provider,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    )
    .select()
    .single()

  if (error) throw new Error(`upsertProfile failed: ${error.message}`)
  return data as Profile
}
