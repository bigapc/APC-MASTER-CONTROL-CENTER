// lib/supabase/client.ts
// Browser-side Supabase client — safe to import in "use client" components.
// Returns null when NEXT_PUBLIC_DATA_MODE=demo or keys are not configured.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isLiveMode, hasSupabaseConfig } from "@/lib/dataMode";

let _client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isLiveMode() || !hasSupabaseConfig()) return null;

  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { auth: { persistSession: true, storageKey: "apc_supabase_session" } }
    );
  }

  return _client;
}
