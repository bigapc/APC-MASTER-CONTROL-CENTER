import type { CurrentUser } from "@/lib/auth";
import { getPersonnelSnapshot } from "./adapter";
import type { PersonnelSnapshot } from "./types";

export type PersonnelServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" };

export async function getPersonnelSnapshotForUser(user: CurrentUser | null): Promise<PersonnelServiceResult<PersonnelSnapshot>> {
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true, data: await getPersonnelSnapshot() };
}