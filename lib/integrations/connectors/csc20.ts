// lib/integrations/connectors/csc20.ts
// CSC 2.0 connector — shares CommunitySafeConnect Supabase queries but
// operates under the "csc_2_0" platform ID. Health is monitored separately.
import type { PlatformReport, PlatformUser, PlatformHealth } from "@/lib/integrations/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const PLATFORM_ID = "csc_2_0" as const;

const DEMO_REPORTS: PlatformReport[] = [
  { id: "CSC2-4001", appId: PLATFORM_ID, title: "CSC 2.0 Beta Report", status: "open", createdAt: new Date().toISOString() },
];

const DEMO_USERS: PlatformUser[] = [
  { id: "u-csc2-1", name: "CSC 2.0 Admin", role: "app_admin" },
];

export async function getCSC20Reports(): Promise<PlatformReport[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return DEMO_REPORTS;

  const { data, error } = await supabase
    .from("apc_reports")
    .select("id, app_id, title, status, created_at")
    .eq("app_id", PLATFORM_ID)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data || data.length === 0) return DEMO_REPORTS;

  return data.map((row) => ({
    id: row.id as string,
    appId: PLATFORM_ID,
    title: row.title as string,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}

export async function getCSC20Users(): Promise<PlatformUser[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return DEMO_USERS;

  const { data, error } = await supabase
    .from("apc_users")
    .select("id, name, role")
    .eq("role", "app_admin")
    .order("name");

  if (error || !data || data.length === 0) return DEMO_USERS;

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    role: row.role as string,
  }));
}

export async function getCSC20Health(): Promise<PlatformHealth> {
  // CSC 2.0 is in monitoring state while beta
  return { appId: PLATFORM_ID, status: "monitoring", uptime: "98.9%" };
}
