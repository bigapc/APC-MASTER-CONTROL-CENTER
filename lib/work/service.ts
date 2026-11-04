import type { CurrentUser } from "@/lib/auth";
import { getWorkDataAdapter } from "./adapter";
import { canPerformWorkOperation } from "./authorization";
import type { APCApproval, APCProject, APCTask, APCWorkSnapshot } from "./types";

export type WorkServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "Unauthorized" | "Forbidden" | "NotConfigured" };

function denied<T>(user: CurrentUser | null, operation: Parameters<typeof canPerformWorkOperation>[1]): WorkServiceResult<T> | null {
  if (!user) return { ok: false, error: "Unauthorized" };
  if (!canPerformWorkOperation(user, operation)) return { ok: false, error: "Forbidden" };
  return null;
}

export async function listProjects(user: CurrentUser | null): Promise<WorkServiceResult<readonly APCProject[]>> {
  const failure = denied<readonly APCProject[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getWorkDataAdapter().listProjects() };
}

export async function getWorkSnapshotForUser(user: CurrentUser | null): Promise<WorkServiceResult<APCWorkSnapshot>> {
  const failure = denied<APCWorkSnapshot>(user, "view");
  if (failure) return failure;
  const persistence = getWorkDataAdapter();
  const [projects, tasks, approvals] = await Promise.all([
    persistence.listProjects(),
    persistence.listTasks(),
    persistence.listApprovals(),
  ]);
  return { ok: true, data: { projects, tasks, approvals, sourceStatus: persistence.status } };
}

export async function listTasks(user: CurrentUser | null): Promise<WorkServiceResult<readonly APCTask[]>> {
  const failure = denied<readonly APCTask[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getWorkDataAdapter().listTasks() };
}

export async function listApprovals(user: CurrentUser | null): Promise<WorkServiceResult<readonly APCApproval[]>> {
  const failure = denied<readonly APCApproval[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getWorkDataAdapter().listApprovals() };
}

export async function createProject(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "create");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function updateProject(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "update");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function createTask(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "create");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function updateTask(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "update");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function requestApproval(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "create");
  return failure ?? { ok: false, error: "NotConfigured" };
}

export async function reviewApproval(user: CurrentUser | null): Promise<WorkServiceResult<null>> {
  const failure = denied<null>(user, "approve");
  return failure ?? { ok: false, error: "NotConfigured" };
}
