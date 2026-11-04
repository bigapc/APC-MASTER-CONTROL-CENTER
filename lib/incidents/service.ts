import type { CurrentUser } from "@/lib/auth";
import { getIncidentDataAdapter } from "./adapter";
import { canPerformIncidentOperation } from "./authorization";
import type { APCIncident, APCIncidentSnapshot } from "./types";

export type IncidentServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "Unauthorized" | "Forbidden" | "NotConfigured" };

function denied<T>(user: CurrentUser | null, operation: Parameters<typeof canPerformIncidentOperation>[1]): IncidentServiceResult<T> | null {
  if (!user) return { ok: false, error: "Unauthorized" };
  if (!canPerformIncidentOperation(user, operation)) return { ok: false, error: "Forbidden" };
  return null;
}

export async function listIncidents(user: CurrentUser | null): Promise<IncidentServiceResult<readonly APCIncident[]>> {
  const failure = denied<readonly APCIncident[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getIncidentDataAdapter().listIncidents() };
}

export async function getIncidentSnapshotForUser(user: CurrentUser | null): Promise<IncidentServiceResult<APCIncidentSnapshot>> {
  const failure = denied<APCIncidentSnapshot>(user, "view");
  if (failure) return failure;
  const persistence = getIncidentDataAdapter();
  return { ok: true, data: { incidents: await persistence.listIncidents(), sourceStatus: persistence.status } };
}

export async function getIncident(user: CurrentUser | null, incidentId: string): Promise<IncidentServiceResult<APCIncident | null>> {
  const failure = denied<APCIncident | null>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getIncidentDataAdapter().getIncident(incidentId) };
}

export async function createIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "create");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function updateIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "update");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function acknowledgeIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "acknowledge");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function escalateIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "escalate");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function assignIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "assign");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function resolveIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "resolve");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function closeIncident(user: CurrentUser | null): Promise<IncidentServiceResult<null>> {
  const failure = denied<null>(user, "close");
  return failure ?? { ok: false, error: "NotConfigured" };
}
