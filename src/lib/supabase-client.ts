import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null

export function getSupabaseClient(url: string, key: string): SupabaseClient {
  if (client === null) {
    return client = createClient(url, key)
  }

  return client
}
