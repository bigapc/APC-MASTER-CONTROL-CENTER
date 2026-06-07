export type UserRole =
  | "super_admin"
  | "app_admin"
  | "dispatcher"
  | "agency_manager"
  | "organization_manager";

export const ROLE_PERMISSIONS = {
  super_admin: ["*"],

  app_admin: [
    "apps.read",
    "apps.write",
    "reports.read",
    "reports.write",
  ],

  dispatcher: [
    "dispatch.read",
    "dispatch.write",
  ],

  agency_manager: [
    "agencies.read",
    "agencies.write",
  ],

  organization_manager: [
    "organizations.read",
    "organizations.write",
  ],
};
