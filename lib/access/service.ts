import type { CurrentUser } from "@/lib/auth";
import { canPerformAccessOperation, type AccessOperation } from "./authorization";
import { getIdentityDataAdapter, type IdentityDataAdapter } from "./adapter";
import type { AccessSnapshot, APCIdentity, APCAccessRequest, APCUnitAccessGrant, APCAccessAuditRecord } from "./types";

export type AccessServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" | "Forbidden" | "NotConfigured" };

function check<T>(user: CurrentUser | null, operation: AccessOperation): AccessServiceResult<T> | null {
  if (!user) return { ok: false, error: "Unauthorized" };
  if (!canPerformAccessOperation(user, operation)) return { ok: false, error: "Forbidden" };
  return null;
}

function adapter(): IdentityDataAdapter { return getIdentityDataAdapter(); }

export async function getAccessSnapshotForUser(user: CurrentUser | null): Promise<AccessServiceResult<AccessSnapshot>> {
  const failure = check<AccessSnapshot>(user, "view");
  if (failure) return failure;
  const data = await import("./adapter").then(({ getAccessSnapshot }) => getAccessSnapshot());
  return { ok: true, data };
}

export async function getAccessAuditSnapshotForUser(user: CurrentUser | null): Promise<AccessServiceResult<AccessSnapshot>> {
  const failure = check<AccessSnapshot>(user, "view_audit");
  if (failure) return failure;
  const data = await import("./adapter").then(({ getAccessSnapshot }) => getAccessSnapshot());
  return { ok: true, data };
}

export async function listIdentities(user: CurrentUser | null): Promise<AccessServiceResult<readonly APCIdentity[]>> {
  const failure = check<readonly APCIdentity[]>(user, "view");
  return failure ?? { ok: true, data: await adapter().listIdentities() };
}

export async function listAccessRequests(user: CurrentUser | null): Promise<AccessServiceResult<readonly APCAccessRequest[]>> {
  const failure = check<readonly APCAccessRequest[]>(user, "view");
  return failure ?? { ok: true, data: await adapter().listAccessRequests() };
}

export async function listUnitAccess(user: CurrentUser | null): Promise<AccessServiceResult<readonly APCUnitAccessGrant[]>> {
  const failure = check<readonly APCUnitAccessGrant[]>(user, "view");
  return failure ?? { ok: true, data: await adapter().listUnitAccess() };
}

export async function listAccessAudit(user: CurrentUser | null): Promise<AccessServiceResult<readonly APCAccessAuditRecord[]>> {
  const failure = check<readonly APCAccessAuditRecord[]>(user, "view_audit");
  return failure ?? { ok: true, data: await adapter().listAudit() };
}

export async function createAccessRequest(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "view");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function reviewAccessRequest(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "review_request");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function assignRole(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "assign_role");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function removeRole(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "remove_role");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function assignUnitAccess(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "manage_unit_access");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function removeUnitAccess(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "manage_unit_access");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function deactivateIdentity(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "deactivate_identity");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function reactivateIdentity(user: CurrentUser | null): Promise<AccessServiceResult<null>> {
  const failure = check<null>(user, "reactivate_identity");
  return failure ?? { ok: false, error: "NotConfigured" };
}
