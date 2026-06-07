// lib/supabase/server.ts
// Server-side Supabase client — use only in server components, route handlers,
// and server actions. Uses the service role key when available so it bypasses
// RLS; falls back to anon key for read-only queries.
// Returns null when NEXT_PUBLIC_DATA_MODE=demo or keys are not configured.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isLiveMode, hasSupabaseConfig } from "@/lib/dataMode";

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isLiveMode() || !hasSupabaseConfig()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  // Prefer service role key for server-side operations; fall back to anon key.
  const key =
    (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
