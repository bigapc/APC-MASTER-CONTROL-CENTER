import type { PlatformReport, PlatformUser, PlatformHealth } from "@/lib/integrations/types";
import { getReportsByPlatform } from "@/lib/supabase/reports";
import { getUsersByRole } from "@/lib/supabase/users";

export interface SafeConnectConnector {
  getReports(): Promise<PlatformReport[]>;
  getUsers(): Promise<PlatformUser[]>;
  getHealth(): Promise<PlatformHealth>;
}

const DEMO_REPORTS: PlatformReport[] = [
  { id: "SC-1001", appId: "safeconnect", title: "Safety Request", status: "open", createdAt: new Date().toISOString() },
  { id: "SC-1002", appId: "safeconnect", title: "Community Alert", status: "resolved", createdAt: new Date().toISOString() },
];

const DEMO_USERS: PlatformUser[] = [
  { id: "u-sc-1", name: "SC Dispatcher One", role: "dispatcher" },
  { id: "u-sc-2", name: "SC Admin", role: "app_admin" },
];

export const safeConnectConnector: SafeConnectConnector = {
  async getReports(): Promise<PlatformReport[]> {
    const live = await getReportsByPlatform("safeconnect");
    return live.length > 0 ? live : DEMO_REPORTS;
  },

  async getUsers(): Promise<PlatformUser[]> {
    const live = await getUsersByRole("dispatcher");
    if (live.length > 0) {
      return live.map((u) => ({ id: u.id, name: u.name, role: u.role }));
    }
    return DEMO_USERS;
  },

  async getHealth(): Promise<PlatformHealth> {
    return { appId: "safeconnect", status: "healthy", uptime: "99.9%" };
  },
};
