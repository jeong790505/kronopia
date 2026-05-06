import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * 서버 컴포넌트용 anon-key 클라이언트.
 * 현재 Phase에서는 profiles 읽기에 admin 클라이언트를 사용하며,
 * 이 클라이언트는 향후 RLS 기반 읽기 전환 시 사용 예정.
 */
export function getServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
