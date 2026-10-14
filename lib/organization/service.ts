import type { CurrentUser } from "@/lib/auth";
import { getOrganizationSnapshot } from "./adapter";
import type { OrganizationSnapshot } from "./structure";

export type OrganizationServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" };

export async function getOrganizationSnapshotForUser(user: CurrentUser | null): Promise<OrganizationServiceResult<OrganizationSnapshot>> {
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true, data: await getOrganizationSnapshot() };
}