export const permissions = {
  super_admin: [
    "*",
  ],

  app_admin: [
    "apps.view",
    "apps.manage",
    "reports.view",
    "reports.manage",
  ],

  dispatcher: [
    "dispatch.view",
    "dispatch.manage",
  ],

  organization_manager: [
    "organizations.view",
  ],
};
