export interface APCSession {
  userId: string;
  email: string;
  role: string;
  appAccess: string[];
}

export const mockSession: APCSession = {
  userId: "apc-owner",

  email: "owner@apc.local",

  role: "super_admin",

  appAccess: [
    "safeconnect",
    "communitysafeconnect",
    "csc_2_0",
  ],
};
