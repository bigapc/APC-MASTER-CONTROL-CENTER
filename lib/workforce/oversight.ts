import { DEMO_USERS } from "@/lib/appConfig";
import { getLiveAuditLog } from "@/lib/events/liveEventEmitter";
import { getAllUsers as getIntegratedUsers } from "@/lib/integrations/platformConnector";
import { getAuditLogs } from "@/lib/supabase/audit";
import { getAllUsers as getSupabaseUsers } from "@/lib/supabase/users";
import type { UserRole } from "@/lib/roles";

export type WorkforceEntry = {
  id: string;
  name: string;
  email: string | null;
  role: string;
  roleLabel: string;
  oversightGroup: "Executive" | "Manager" | "Supervisor" | "Operations";
  appAccess: string;
  status: "Active" | "Monitoring" | "Pending Setup";
  activityCount: number;
  lastActivity: string;
  lastActivityRaw: string | null;
};

function formatRelativeTime(timestamp: string | null) {
  if (!timestamp) {
    return "No recent activity";
  }

  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return "No recent activity";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function roleLabel(role: string) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getOversightGroup(role: string): WorkforceEntry["oversightGroup"] {
  if (role === "super_admin") return "Executive";
  if (role === "agency_manager" || role === "organization_manager") return "Manager";
  if (role === "app_admin") return "Supervisor";
  return "Operations";
}

function getAppAccess(role: string) {
  if (role === "super_admin") return "All Applications";
  if (role === "app_admin") return "Assigned Application Control";
  if (role === "agency_manager") return "CommunitySafeConnect, CSC 2.0";
  if (role === "organization_manager") return "CommunitySafeConnect";
  if (role === "dispatcher") return "SafeConnect, CSC 2.0";
  return "Connected Applications";
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function toWorkforceEntry(entry: {
  id: string;
  name: string;
  email: string | null;
  role: string;
}): WorkforceEntry {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    role: entry.role,
    roleLabel: roleLabel(entry.role),
    oversightGroup: getOversightGroup(entry.role),
    appAccess: getAppAccess(entry.role),
    status: "Pending Setup",
    activityCount: 0,
    lastActivity: "No recent activity",
    lastActivityRaw: null,
  };
}

export async function getWorkforceOversight() {
  const [supabaseUsers, integratedUsers, persistedAudit] = await Promise.all([
    getSupabaseUsers(),
    getIntegratedUsers(),
    getAuditLogs(200),
  ]);

  const liveAudit = getLiveAuditLog();
  const allAudit = [...liveAudit, ...persistedAudit]
    .filter((entry, index, entries) => entries.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const rawEntries = supabaseUsers.length > 0
    ? supabaseUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }))
    : integratedUsers.length > 0
      ? integratedUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: null,
          role: user.role as UserRole,
        }))
      : DEMO_USERS.map((user, index) => ({
          id: `demo-${index + 1}`,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase().replace(/\s+/g, "_") as UserRole,
        }));

  const dedupedMap = new Map<string, WorkforceEntry>();
  for (const entry of rawEntries) {
    const key = `${normalizeName(entry.name)}:${entry.role}`;
    if (!dedupedMap.has(key)) {
      dedupedMap.set(key, toWorkforceEntry(entry));
    }
  }

  const workforce = Array.from(dedupedMap.values()).map((entry) => {
    const matchingAudit = allAudit.filter((log) => normalizeName(log.actor) === normalizeName(entry.name));
    const latest = matchingAudit[0]?.timestamp ?? null;
    const activityCount = matchingAudit.length;

    return {
      ...entry,
      activityCount,
      lastActivityRaw: latest,
      lastActivity: formatRelativeTime(latest),
      status: activityCount > 0 ? "Active" : supabaseUsers.length > 0 || integratedUsers.length > 0 ? "Monitoring" : "Pending Setup",
    } satisfies WorkforceEntry;
  });

  const managers = workforce.filter((entry) => entry.oversightGroup === "Manager").length;
  const supervisors = workforce.filter((entry) => entry.oversightGroup === "Supervisor" || entry.oversightGroup === "Executive").length;
  const operators = workforce.filter((entry) => entry.oversightGroup === "Operations").length;
  const activeStaff = workforce.filter((entry) => entry.status === "Active").length;
  const totalActivities = workforce.reduce((sum, entry) => sum + entry.activityCount, 0);

  return {
    workforce: workforce.sort((a, b) => {
      if (b.activityCount !== a.activityCount) {
        return b.activityCount - a.activityCount;
      }

      return a.name.localeCompare(b.name);
    }),
    summary: {
      totalStaff: workforce.length,
      managers,
      supervisors,
      operators,
      activeStaff,
      totalActivities,
    },
  };
}
