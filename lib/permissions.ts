export const PERMISSIONS = {
  super_admin: [
    "all",
  ],

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

  organization_manager: [
    "organizations.read",
    "organizations.write",
  ],

  agency_manager: [
    "agencies.read",
    "agencies.write",
  ],
};
