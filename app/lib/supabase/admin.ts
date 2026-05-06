import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * 서버 전용 service-role 클라이언트.
 * RLS를 우회하므로 클라이언트 컴포넌트에서 절대 import 금지.
 */
export function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
