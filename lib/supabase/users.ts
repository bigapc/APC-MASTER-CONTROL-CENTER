// lib/supabase/users.ts
// Server-side Supabase queries for the apc_users table.
// Returns null when Supabase is not configured (caller falls back to demo data).
import type { CurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "./server";

export interface SupabaseUser extends CurrentUser {
  createdAt: string;
}

export async function getUserById(id: string): Promise<SupabaseUser | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("apc_users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    role: data.role as CurrentUser["role"],
    createdAt: data.created_at as string,
  };
}

export async function getAllUsers(): Promise<SupabaseUser[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as CurrentUser["role"],
    createdAt: row.created_at as string,
  }));
}

export async function getUsersByRole(
  role: CurrentUser["role"]
): Promise<SupabaseUser[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_users")
    .select("id, name, email, role, created_at")
    .eq("role", role)
    .order("name");

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as CurrentUser["role"],
    createdAt: row.created_at as string,
  }));
}
