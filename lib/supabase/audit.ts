// lib/supabase/audit.ts
// Server-side Supabase queries for the apc_audit_logs table.
// Returns empty arrays when Supabase is not configured.
import { getSupabaseServerClient } from "./server";
import type { AuditRecord } from "@/lib/services/auditService";

export interface SupabaseAuditRecord extends AuditRecord {
  source?: string;
}

export async function getAuditLogs(limit = 100): Promise<SupabaseAuditRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_audit_logs")
    .select("id, action, actor, source, timestamp")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    action: row.action as string,
    actor: row.actor as string,
    source: row.source as string | undefined,
    timestamp: row.timestamp as string,
  }));
}

export async function getAuditLogsByActor(
  actor: string,
  limit = 50
): Promise<SupabaseAuditRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_audit_logs")
    .select("id, action, actor, source, timestamp")
    .eq("actor", actor)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    action: row.action as string,
    actor: row.actor as string,
    source: row.source as string | undefined,
    timestamp: row.timestamp as string,
  }));
}

export async function insertAuditLog(
  record: Omit<SupabaseAuditRecord, "id">
): Promise<SupabaseAuditRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("apc_audit_logs")
    .insert({
      action: record.action,
      actor: record.actor,
      source: record.source ?? "apc",
      timestamp: record.timestamp,
    })
    .select("id, action, actor, source, timestamp")
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    action: data.action as string,
    actor: data.actor as string,
    source: data.source as string | undefined,
    timestamp: data.timestamp as string,
  };
}
