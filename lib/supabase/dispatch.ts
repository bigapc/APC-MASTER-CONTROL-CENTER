// lib/supabase/dispatch.ts
// Server-side Supabase queries for the apc_dispatch_cases table.
// Returns empty arrays when Supabase is not configured.
import { getSupabaseServerClient } from "./server";
import type { DispatchCase } from "@/lib/integrations/dispatcherConnector";

export async function getDispatchQueue(): Promise<DispatchCase[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("apc_dispatch_cases")
    .select("id, subject, status, assigned_to, priority, created_at, updated_at")
    .in("status", ["queued", "active", "escalated"])
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    subject: row.subject as string,
    status: row.status as DispatchCase["status"],
    assignedTo: (row.assigned_to as string | null) ?? null,
    priority: row.priority as DispatchCase["priority"],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function getDispatchCaseById(id: string): Promise<DispatchCase | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("apc_dispatch_cases")
    .select("id, subject, status, assigned_to, priority, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    subject: data.subject as string,
    status: data.status as DispatchCase["status"],
    assignedTo: (data.assigned_to as string | null) ?? null,
    priority: data.priority as DispatchCase["priority"],
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export async function assignDispatchCase(
  caseId: string,
  dispatcherId: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("apc_dispatch_cases")
    .update({
      assigned_to: dispatcherId,
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseId);

  return !error;
}

export async function escalateDispatchCase(
  caseId: string,
  reason: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("apc_dispatch_cases")
    .update({
      status: "escalated",
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseId);

  if (!error) {
    await supabase.from("apc_dispatch_escalations").insert({
      case_id: caseId,
      reason,
      escalated_at: new Date().toISOString(),
    });
  }

  return !error;
}

export async function closeDispatchCase(caseId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("apc_dispatch_cases")
    .update({
      status: "closed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", caseId);

  return !error;
}
