import { supabaseBrowserClient } from '@/lib/supabase'

export async function getAccessToken() {
  const { data } = await supabaseBrowserClient.auth.getSession()

  return data.session?.access_token ?? null
}
