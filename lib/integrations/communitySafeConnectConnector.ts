import type { PlatformReport, PlatformUser, PlatformHealth } from "@/lib/integrations/types";
import { getReportsByPlatform } from "@/lib/supabase/reports";
import { getUsersByRole } from "@/lib/supabase/users";

export interface CommunityOrganization {
  id: string;
  name: string;
  region: string;
  status: "active" | "pending";
}

export interface CommunitySafeConnectConnector {
  getReports(): Promise<PlatformReport[]>;
  getUsers(): Promise<PlatformUser[]>;
  getHealth(): Promise<PlatformHealth>;
  getOrganizations(): Promise<CommunityOrganization[]>;
}

const now = new Date().toISOString();

const DEMO_REPORTS: PlatformReport[] = [
  { id: "CSC-3001", appId: "communitysafeconnect", title: "Neighborhood Watch Report", status: "open", createdAt: now },
];

const DEMO_USERS: PlatformUser[] = [
  { id: "u-csc-1", name: "CSC Org Manager", role: "organization_manager" },
];

export const communitySafeConnectConnector: CommunitySafeConnectConnector = {
  async getReports(): Promise<PlatformReport[]> {
    const live = await getReportsByPlatform("communitysafeconnect");
    return live.length > 0 ? live : DEMO_REPORTS;
  },

  async getUsers(): Promise<PlatformUser[]> {
    const live = await getUsersByRole("organization_manager");
    if (live.length > 0) {
      return live.map((u) => ({ id: u.id, name: u.name, role: u.role }));
    }
    return DEMO_USERS;
  },

  async getHealth(): Promise<PlatformHealth> {
    return { appId: "communitysafeconnect", status: "healthy", uptime: "99.8%" };
  },

  async getOrganizations(): Promise<CommunityOrganization[]> {
    return [
      { id: "org-1", name: "Westside Community Watch", region: "West", status: "active" },
      { id: "org-2", name: "Eastside Safety Network", region: "East", status: "pending" },
    ];
  },
};
