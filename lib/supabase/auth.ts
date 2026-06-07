// lib/supabase/auth.ts
// Supabase Auth helpers for sign-in, sign-out, and session resolution.
// All functions return null/false gracefully when Supabase is not configured.
import type { CurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "./server";

/**
 * Sign in with Supabase Auth. Returns the resolved CurrentUser on success
 * or null on failure. Callers should fall back to local credential validation
 * when this returns null (e.g. when in demo mode).
 */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<CurrentUser | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) return null;

  // Read profile row so we can return role + display name.
  const { data: profile } = await supabase
    .from("apc_users")
    .select("id, name, email, role")
    .eq("auth_id", data.user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id as string,
    name: profile.name as string,
    email: profile.email as string,
    role: profile.role as CurrentUser["role"],
  };
}

/**
 * Sign out via Supabase Auth. No-op when Supabase is not configured.
 */
export async function supabaseSignOut(): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Resolve a Supabase JWT to a CurrentUser.
 * Returns null when the token is invalid or Supabase is not configured.
 */
export async function resolveSupabaseSession(
  accessToken: string
): Promise<CurrentUser | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("apc_users")
    .select("id, name, email, role")
    .eq("auth_id", data.user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id as string,
    name: profile.name as string,
    email: profile.email as string,
    role: profile.role as CurrentUser["role"],
  };
}
