// lib/supabase/reports.ts
// Server-side Supabase queries for platform reports.
// Returns empty arrays when Supabase is not configured.
import type { PlatformId } from "@/lib/types";
import type { PlatformReport } from "@/lib/integrations/types";
import { getSupabaseServerClient } from "./server";

export async function getReportsByPlatform(
  appId: PlatformId
): Promise<PlatformReport[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_reports")
    .select("id, app_id, title, status, created_at")
    .eq("app_id", appId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    appId: row.app_id as PlatformId,
    title: row.title as string,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}

export async function getAllReports(): Promise<PlatformReport[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_reports")
    .select("id, app_id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    appId: row.app_id as PlatformId,
    title: row.title as string,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}

export async function createReport(
  report: Omit<PlatformReport, "id" | "createdAt">
): Promise<PlatformReport | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("apc_reports")
    .insert({
      app_id: report.appId,
      title: report.title,
      status: report.status,
    })
    .select("id, app_id, title, status, created_at")
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    appId: data.app_id as PlatformId,
    title: data.title as string,
    status: data.status as string,
    createdAt: data.created_at as string,
  };
}
