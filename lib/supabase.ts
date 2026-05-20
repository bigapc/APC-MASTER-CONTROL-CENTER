import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig, isLiveMode } from "@/lib/dataMode";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!isLiveMode()) {
    return null;
  }

  if (!hasSupabaseConfig()) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  return cachedClient;
}

export const supabase = getSupabaseClient();
