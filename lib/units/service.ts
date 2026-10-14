import type { CurrentUser } from "@/lib/auth";
import { getUnitDirectorySnapshot } from "./adapter";
import type { UnitDirectorySnapshot } from "./types";

export type UnitDirectoryServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" };

export async function getUnitDirectoryForUser(user: CurrentUser | null): Promise<UnitDirectoryServiceResult<UnitDirectorySnapshot>> {
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true, data: await getUnitDirectorySnapshot() };
}