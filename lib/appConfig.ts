export const APP_CONFIG = {
  appId: process.env.NEXT_PUBLIC_APP_ID || "apc_control_center",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "APC Master Control Center",
  apps: [
    {
      id: "safeconnect",
      name: "SafeConnect",
      description: "Safe property exchange and courier safety platform",
      status: "active",
    },
    {
      id: "communitysafeconnect",
      name: "CommunitySafeConnect",
      description: "Community safety, tasks, news, and reporting platform",
      status: "active",
    },
    {
      id: "csc_2_0",
      name: "CommunitySafeConnect-CSC-2.0",
      description: "Advanced APC-CSC dispatcher and backend control hub",
      status: "active",
    },
  ],
};