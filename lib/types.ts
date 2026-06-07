export type PlatformId =
  | "safeconnect"
  | "communitysafeconnect"
  | "csc_2_0";

export type UserRole =
  | "super_admin"
  | "app_admin"
  | "dispatcher"
  | "organization_manager"
  | "agency_manager";

export interface Platform {
  id: PlatformId;
  name: string;
  status: "healthy" | "warning" | "offline";
}

export interface DispatchCase {
  id: string;
  platformId: PlatformId;
  priority: "low" | "medium" | "high";
  status: "open" | "assigned" | "in_progress" | "closed";
  title: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface ActivityFeedItem {
  title: string;
  detail: string;
  time: string;
}

export type AlertSeverity = "High" | "Medium" | "Low";

export interface AlertsCenterItem {
  title: string;
  severity: AlertSeverity;
  detail: string;
}

export interface NotificationCenterItem {
  title: string;
  priority: AlertSeverity;
}

export interface DashboardMetrics {
  connectedApps: number;
  activeUsers: number;
  openCases: number;
  resolvedCases: number;
  organizations: number;
}

export interface DispatchMetrics {
  activeCases: number;
  pendingDispatches: number;
  operatorsOnline: number;
  escalations: number;
}

export interface SystemMetrics {
  uptime: string;
  apiResponse: string;
  cpuUsage: string;
  memoryUsage: string;
}

export interface AnalyticsPlatformBreakdown {
  name: string;
  users: number;
  reports: number;
  status: "Healthy" | "Monitoring";
}

export interface DispatchQueueItem {
  id: string;
  type: string;
  priority: AlertSeverity;
  status: string;
}

export interface DispatcherStatusItem {
  name: string;
  status: "Online" | "Busy" | "Offline";
}

export interface SystemHealthItem {
  name: string;
  status: "Operational" | "Monitoring";
  uptime: string;
}

export interface OrganizationItem {
  name: string;
  members: number;
  status: "Active" | "Pending";
}

export interface AdminRoleItem {
  role: string;
  access: string;
  users: number;
}

export interface AuditTimelineItem {
  action: string;
  user: string;
  time: string;
}

export interface AgencyItem {
  name: string;
  status: "Active" | "Pending";
}

export interface FranchiseMetrics {
  activeFranchises: number;
  expansionRegions: number;
}
