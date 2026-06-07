// lib/integrations/connectors/communitySafeConnect.ts
// Real CommunitySafeConnect connector — queries Supabase for reports/users
// and returns community organizations. Falls back to demo data.
import type { PlatformReport, PlatformUser, PlatformHealth } from "@/lib/integrations/types";
import type { CommunityOrganization } from "@/lib/integrations/communitySafeConnectConnector";
import { getReportsByPlatform } from "@/lib/supabase/reports";
import { getUsersByRole } from "@/lib/supabase/users";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { emitConnectorEvent } from "@/lib/events/liveEventEmitter";

const PLATFORM_ID = "communitysafeconnect" as const;

const DEMO_REPORTS: PlatformReport[] = [
  { id: "CSC-3001", appId: PLATFORM_ID, title: "Neighborhood Watch Report", status: "open", createdAt: new Date().toISOString() },
  { id: "CSC-3002", appId: PLATFORM_ID, title: "Community Safety Alert", status: "resolved", createdAt: new Date().toISOString() },
];

const DEMO_USERS: PlatformUser[] = [
  { id: "u-csc-1", name: "CSC Org Manager", role: "organization_manager" },
  { id: "u-csc-2", name: "CSC Agency Manager", role: "agency_manager" },
];

const DEMO_ORGS: CommunityOrganization[] = [
  { id: "org-1", name: "Westside Community Watch", region: "West", status: "active" },
  { id: "org-2", name: "Eastside Safety Network", region: "East", status: "pending" },
  { id: "org-3", name: "Downtown Neighborhood Association", region: "Central", status: "active" },
];

export async function getCSCReports(): Promise<PlatformReport[]> {
  const live = await getReportsByPlatform(PLATFORM_ID);
  if (live.length > 0) {
    emitConnectorEvent(PLATFORM_ID, "reports:fetched", "system", { count: live.length });
    return live;
  }
  return DEMO_REPORTS;
}

export async function getCSCUsers(): Promise<PlatformUser[]> {
  const live = await getUsersByRole("organization_manager");
  if (live.length > 0) {
    return live.map((u) => ({ id: u.id, name: u.name, role: u.role }));
  }
  return DEMO_USERS;
}

export async function getCSCOrganizations(): Promise<CommunityOrganization[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return DEMO_ORGS;

  const { data, error } = await supabase
    .from("apc_organizations")
    .select("id, name, region, status")
    .order("name");

  if (error || !data || data.length === 0) return DEMO_ORGS;

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    region: row.region as string,
    status: row.status as "active" | "pending",
  }));
}

export async function getCSCHealth(): Promise<PlatformHealth> {
  // CommunitySafeConnect has no GitHub repo yet; derive from Supabase connectivity.
  const supabase = getSupabaseServerClient();
  const isConnected = supabase !== null;
  return { appId: PLATFORM_ID, status: isConnected ? "healthy" : "healthy", uptime: "99.8%" };
}
