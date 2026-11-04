import type { CurrentUser } from "@/lib/auth";
import { getAcademySnapshot } from "./adapter";
import type { AcademySnapshot } from "./types";

export type AcademyServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" };

export async function getAcademySnapshotForUser(user: CurrentUser | null): Promise<AcademyServiceResult<AcademySnapshot>> {
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true, data: await getAcademySnapshot() };
}