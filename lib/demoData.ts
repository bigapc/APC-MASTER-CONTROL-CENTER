import type {
  AdminRoleItem,
  AgencyItem,
  ActivityFeedItem,
  AnalyticsPlatformBreakdown,
  AlertsCenterItem,
  AuditTimelineItem,
  DashboardMetrics,
  DispatcherStatusItem,
  DispatchQueueItem,
  DispatchMetrics,
  NotificationCenterItem,
  OrganizationItem,
  FranchiseMetrics,
  SystemHealthItem,
  SystemMetrics,
} from "@/lib/types";

export const dashboardMetrics: DashboardMetrics = {
  connectedApps: 3,
  activeUsers: 42,
  openCases: 17,
  resolvedCases: 111,
  organizations: 8,
};

export const dispatchMetrics: DispatchMetrics = {
  activeCases: 17,
  pendingDispatches: 6,
  operatorsOnline: 9,
  escalations: 2,
};

export const systemMetrics: SystemMetrics = {
  uptime: "99.9%",
  apiResponse: "118ms",
  cpuUsage: "18%",
  memoryUsage: "42%",
};

export const activityFeedItems: ActivityFeedItem[] = [
  {
    title: "SafeConnect incident reviewed",
    detail: "Owner command acknowledged and queued for follow-up.",
    time: "2 minutes ago",
  },
  {
    title: "Dispatcher queue updated",
    detail: "Assignment routing remains active across the APC command stack.",
    time: "14 minutes ago",
  },
  {
    title: "System health check completed",
    detail: "Core services and platform monitors returned healthy status.",
    time: "1 hour ago",
  },
];

export const alertsCenterItems: AlertsCenterItem[] = [
  {
    title: "Backend identity verification",
    severity: "High",
    detail: "Confirm owner access and production readiness before backend rollout.",
  },
  {
    title: "Dispatcher queue visibility",
    severity: "Medium",
    detail: "Monitor queue aging and assignment ownership across all dispatch channels.",
  },
  {
    title: "System monitoring active",
    severity: "Low",
    detail: "Platform checks are healthy, but continuous observation remains enabled.",
  },
];

export const notificationCenterItems: NotificationCenterItem[] = [
  {
    title: "New SafeConnect Incident",
    priority: "High",
  },
  {
    title: "Dispatcher Assigned",
    priority: "Medium",
  },
  {
    title: "System Health Warning",
    priority: "Low",
  },
];

export const analyticsPlatformBreakdown: AnalyticsPlatformBreakdown[] = [
  {
    name: "SafeConnect",
    users: 21,
    reports: 78,
    status: "Healthy",
  },
  {
    name: "CommunitySafeConnect",
    users: 13,
    reports: 32,
    status: "Healthy",
  },
  {
    name: "CSC 2.0",
    users: 8,
    reports: 18,
    status: "Monitoring",
  },
];

export const dispatchQueueItems: DispatchQueueItem[] = [
  {
    id: "SC-1001",
    type: "Wellness Check",
    priority: "High",
    status: "Waiting Assignment",
  },
  {
    id: "SC-1002",
    type: "Courier Escort Request",
    priority: "Medium",
    status: "Assigned",
  },
  {
    id: "SC-1003",
    type: "Community Assistance",
    priority: "Low",
    status: "In Progress",
  },
];

export const dispatcherStatusItems: DispatcherStatusItem[] = [
  {
    name: "Dispatcher Alpha",
    status: "Online",
  },
  {
    name: "Dispatcher Bravo",
    status: "Busy",
  },
  {
    name: "Dispatcher Charlie",
    status: "Offline",
  },
];

export const dispatchIncidentItems: string[] = [
  "New SafeConnect safety request submitted",
  "Dispatcher assigned to wellness check",
  "CommunitySafeConnect organization joined",
  "Courier route updated",
];

export const systemHealthItems: SystemHealthItem[] = [
  {
    name: "APC Master Control Center",
    status: "Operational",
    uptime: "99.9%",
  },
  {
    name: "SafeConnect",
    status: "Operational",
    uptime: "99.8%",
  },
  {
    name: "CommunitySafeConnect",
    status: "Operational",
    uptime: "99.7%",
  },
  {
    name: "CSC 2.0",
    status: "Monitoring",
    uptime: "98.9%",
  },
];

export const organizationItems: OrganizationItem[] = [
  {
    name: "APC Community Alliance",
    members: 24,
    status: "Active",
  },
  {
    name: "SafeConnect Outreach",
    members: 12,
    status: "Active",
  },
  {
    name: "Community Support Network",
    members: 18,
    status: "Pending",
  },
];

export const adminRoleItems: AdminRoleItem[] = [
  {
    role: "APC Super Admin",
    access: "Full Platform Access",
    users: 1,
  },
  {
    role: "Application Admin",
    access: "Application Management",
    users: 3,
  },
  {
    role: "Dispatcher",
    access: "Dispatch Operations",
    users: 5,
  },
  {
    role: "Organization Manager",
    access: "Organization Oversight",
    users: 8,
  },
];

export const auditTimelineItems: AuditTimelineItem[] = [
  {
    action: "SafeConnect Report Created",
    user: "System",
    time: "2 minutes ago",
  },
  {
    action: "Dispatcher Assigned Case",
    user: "Dispatcher Alpha",
    time: "15 minutes ago",
  },
  {
    action: "Organization Updated",
    user: "Admin",
    time: "1 hour ago",
  },
  {
    action: "Role Permission Changed",
    user: "APC Super Admin",
    time: "3 hours ago",
  },
];

export const agencyItems: AgencyItem[] = [
  {
    name: "Community Response Agency",
    status: "Active",
  },
  {
    name: "Safety Outreach Services",
    status: "Pending",
  },
];

export const franchiseMetrics: FranchiseMetrics = {
  activeFranchises: 0,
  expansionRegions: 4,
};
