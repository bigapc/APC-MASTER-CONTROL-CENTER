// lib/integrations/connectors/safeconnect.ts
// Real SafeConnect connector — queries Supabase for reports/users and falls back
// to demo data. Health is derived from GitHub workflow status.
// This is the swap for safeconnectConnector.ts when SafeConnect is live.
import type { PlatformReport, PlatformUser, PlatformHealth } from "@/lib/integrations/types";
import { getReportsByPlatform } from "@/lib/supabase/reports";
import { getUsersByRole } from "@/lib/supabase/users";
import { getRepoStatus, getWorkflowRuns } from "@/lib/github/client";
import { emitConnectorEvent, emitNotification } from "@/lib/events/liveEventEmitter";

const PLATFORM_ID = "safeconnect" as const;
const GITHUB_OWNER = "bigapc";
const GITHUB_REPO = "homework"; // SafeConnect lives at bigapc/homework

const DEMO_REPORTS: PlatformReport[] = [
  { id: "SC-1001", appId: PLATFORM_ID, title: "Safety Request", status: "open", createdAt: new Date().toISOString() },
  { id: "SC-1002", appId: PLATFORM_ID, title: "Community Alert", status: "resolved", createdAt: new Date().toISOString() },
  { id: "SC-1003", appId: PLATFORM_ID, title: "Welfare Check", status: "open", createdAt: new Date().toISOString() },
];

const DEMO_USERS: PlatformUser[] = [
  { id: "u-sc-1", name: "SC Dispatcher One", role: "dispatcher" },
  { id: "u-sc-2", name: "SC Dispatcher Two", role: "dispatcher" },
  { id: "u-sc-3", name: "SC Admin", role: "app_admin" },
];

export async function getSafeConnectReports(): Promise<PlatformReport[]> {
  const live = await getReportsByPlatform(PLATFORM_ID);
  if (live.length > 0) {
    emitConnectorEvent(PLATFORM_ID, "reports:fetched", "system", { count: live.length, source: "supabase" });
    return live;
  }
  return DEMO_REPORTS;
}

export async function getSafeConnectUsers(): Promise<PlatformUser[]> {
  const live = await getUsersByRole("dispatcher");
  if (live.length > 0) {
    return live.map((u) => ({ id: u.id, name: u.name, role: u.role }));
  }
  return DEMO_USERS;
}

export async function getSafeConnectHealth(): Promise<PlatformHealth> {
  const [repoStatus, workflows] = await Promise.all([
    getRepoStatus(GITHUB_OWNER, GITHUB_REPO),
    getWorkflowRuns(GITHUB_OWNER, GITHUB_REPO),
  ]);

  // Derive health from last CI workflow run
  const lastRun = workflows[0];
  const ciOk = !lastRun || lastRun.status === "success" || lastRun.status === "in_progress";
  const repoOk = repoStatus.status !== "offline";

  const status = repoOk && ciOk ? "healthy" : "warning";

  if (status === "warning") {
    emitNotification(
      "SafeConnect Health Degraded",
      `GitHub repo ${GITHUB_OWNER}/${GITHUB_REPO} — last CI: ${lastRun?.status ?? "unknown"}`,
      "warning",
      PLATFORM_ID
    );
  }

  return { appId: PLATFORM_ID, status, uptime: repoOk ? "99.9%" : "degraded" };
}
