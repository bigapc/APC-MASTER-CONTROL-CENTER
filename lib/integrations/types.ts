export type PlatformId =
  | "safeconnect"
  | "communitysafeconnect"
  | "csc_2_0"
  | "csc_nextgen";

export interface PlatformReport {
  id: string;
  appId: PlatformId;
  title: string;
  status: string;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  role: string;
}

export interface PlatformHealth {
  appId: PlatformId;
  status: string;
  uptime: string;
}
