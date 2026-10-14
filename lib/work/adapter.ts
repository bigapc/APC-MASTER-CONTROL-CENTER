import type { APCWorkSnapshot } from "./types";

export interface WorkDataAdapter {
  readonly status: APCWorkSnapshot["sourceStatus"];
  listProjects(): Promise<APCWorkSnapshot["projects"]>;
  listTasks(): Promise<APCWorkSnapshot["tasks"]>;
  listApprovals(): Promise<APCWorkSnapshot["approvals"]>;
}

export const unavailableWorkAdapter: WorkDataAdapter = {
  status: "NOT_CONNECTED",
  async listProjects() { return []; },
  async listTasks() { return []; },
  async listApprovals() { return []; },
};

export function getWorkDataAdapter(): WorkDataAdapter {
  // Work tables are not in the current schema; keep persistence replaceable.
  return unavailableWorkAdapter;
}

export async function getWorkSnapshot(): Promise<APCWorkSnapshot> {
  const adapter = getWorkDataAdapter();
  const [projects, tasks, approvals] = await Promise.all([
    adapter.listProjects(),
    adapter.listTasks(),
    adapter.listApprovals(),
  ]);

  return { projects, tasks, approvals, sourceStatus: adapter.status };
}
