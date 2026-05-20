export const APP_CONFIG = {
  appId: process.env.NEXT_PUBLIC_APP_ID || "apc_control_center",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "APC Master Control Center",
  companyName: "Armstrong Pack Company",
  shortCompanyName: "APC",
  ownerName: process.env.NEXT_PUBLIC_APC_OWNER_NAME || "Darrell Armstrong",
  ownerEmail: process.env.NEXT_PUBLIC_APC_OWNER_EMAIL || "apjune3@gmail.com",
  mission:
    "Saving Lives and Building Stronger Communities through Safety and Connections",
  prideStatement:
    "We take pride in delivering secure, trusted, and mission-driven services that strengthen safety and human connection.",
  apps: [
    {
      id: "safeconnect",
      name: "SafeConnect",
      division: "Safety Exchange Platform",
      description:
        "Safe property exchange, courier coordination, survivor support, and urgent safety service workflows.",
      status: "active",
      health: "stable",
      publicUrl: process.env.NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL || "#",
      adminUrl: process.env.NEXT_PUBLIC_SAFECONNECT_ADMIN_URL || "#",
      accent: "Emergency Safety",
    },
    {
      id: "communitysafeconnect",
      name: "CommunitySafeConnect",
      division: "Community Safety Platform",
      description:
        "Community reporting, local tasks, safety news, organization support, and neighborhood connection tools.",
      status: "active",
      health: "stable",
      publicUrl: process.env.NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL || "#",
      adminUrl: process.env.NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL || "#",
      accent: "Community Operations",
    },
    {
      id: "csc_2_0",
      name: "CommunitySafeConnect-CSC-2.0",
      division: "Dispatcher Control Hub",
      description:
        "Advanced APC-CSC operations, dispatcher coordination, backend monitoring, and agency support.",
      status: "active",
      health: "stable",
      publicUrl: process.env.NEXT_PUBLIC_CSC_2_PUBLIC_URL || "#",
      adminUrl: process.env.NEXT_PUBLIC_CSC_2_ADMIN_URL || "#",
      accent: "Command Operations",
    },
  ],
};

export const SAFECONNECT_TEST_ACCOUNTS = [
  {
    label: "Admin",
    email: "apjune3@gmail.com",
    name: "Darrell Armstrong",
    app: "SafeConnect",
    role: "super_admin",
  },
  {
    label: "Courier",
    email: "bizz16295@gmail.com",
    name: "SafeConnect Courier",
    app: "SafeConnect",
    role: "courier",
  },
  {
    label: "Survivor",
    email: "apjune4@gmail.com",
    name: "SafeConnect Survivor",
    app: "SafeConnect",
    role: "survivor",
  },
];

export const DAILY_OPERATION_CHECKLIST = [
  "Verify Supabase backend connection and project owner identity",
  "Review high-priority SafeConnect and CSC reports",
  "Check dispatcher queue and unresolved cases",
  "Confirm courier availability and pending assignments",
  "Review alerts, notifications, and failed system checks",
  "Review staff activity and audit log changes",
  "Confirm all three application health cards show stable status",
];

export const DEMO_ALERTS = [
  {
    title: "Backend identity check required",
    app: "APC Control Center",
    priority: "High",
    message:
      "Confirm Supabase is using Darrell Armstrong / apjune3@gmail.com as super_admin before production launch.",
  },
  {
    title: "SafeConnect testing active",
    app: "SafeConnect",
    priority: "Medium",
    message:
      "Admin, Courier, and Survivor test accounts are staged for role verification.",
  },
  {
    title: "GitHub control center repo connected",
    app: "APC Master Control Center",
    priority: "Normal",
    message: "Repo bigapc/APC-MASTER-CONTROL-CENTER is the active build target.",
  },
];

export const DEMO_REPORTS = [
  {
    id: "RPT-1001",
    app: "SafeConnect",
    type: "Safety Exchange Request",
    priority: "High",
    status: "Open",
    submittedBy: "Protected User",
    assignedTo: "Unassigned",
    created: "Today",
  },
  {
    id: "RPT-1002",
    app: "CommunitySafeConnect",
    type: "Community Concern",
    priority: "Normal",
    status: "Review",
    submittedBy: "Community Member",
    assignedTo: "APC Staff",
    created: "Today",
  },
  {
    id: "RPT-1003",
    app: "CSC 2.0",
    type: "Dispatcher Follow-up",
    priority: "Medium",
    status: "Pending",
    submittedBy: "Agency Partner",
    assignedTo: "Dispatcher",
    created: "Yesterday",
  },
];

export const DEMO_USERS = [
  {
    name: "Darrell Armstrong",
    email: "apjune3@gmail.com",
    role: "Super Admin",
    access: "All Applications",
    status: "Active",
  },
  {
    name: "APC Dispatcher",
    email: "dispatcher@apc-control.local",
    role: "Dispatcher",
    access: "SafeConnect, CSC 2.0",
    status: "Pending Setup",
  },
  {
    name: "SafeConnect Admin",
    email: "safeconnect-admin@apc-control.local",
    role: "App Admin",
    access: "SafeConnect",
    status: "Pending Setup",
  },
];

export const DEMO_AUDIT_LOGS = [
  {
    action: "Control Center initialized",
    app: "APC Master Control Center",
    actor: "System",
    time: "Today",
    severity: "Info",
  },
  {
    action: "Connected application registry prepared",
    app: "All Apps",
    actor: "System",
    time: "Today",
    severity: "Info",
  },
  {
    action: "Role architecture staged",
    app: "Admin Access",
    actor: "System",
    time: "Today",
    severity: "Security",
  },
  {
    action: "Owner identity pinned",
    app: "Backend Status",
    actor: "Darrell Armstrong",
    time: "Today",
    severity: "Security",
  },
];

export const STAFF_PERFORMANCE = [
  {
    name: "Darrell Armstrong",
    role: "Super Admin",
    app: "All Apps",
    completed: 12,
    pending: 1,
    score: "98%",
  },
  {
    name: "APC Dispatcher",
    role: "Dispatcher",
    app: "CSC 2.0",
    completed: 0,
    pending: 0,
    score: "Pending Setup",
  },
  {
    name: "SafeConnect Courier Team",
    role: "Courier Operations",
    app: "SafeConnect",
    completed: 0,
    pending: 0,
    score: "Pending Setup",
  },
];
