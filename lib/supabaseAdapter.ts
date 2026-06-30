import { APP_REGISTRY } from "@/lib/appRegistry";
import {
  activityFeedItems,
  adminRoleItems,
  agencyItems,
  alertsCenterItems,
  analyticsPlatformBreakdown,
  auditTimelineItems,
  dashboardMetrics,
  dispatcherStatusItems,
  dispatchIncidentItems,
  dispatchMetrics,
  dispatchQueueItems,
  franchiseMetrics,
  notificationCenterItems,
  organizationItems,
  systemHealthItems,
  systemMetrics,
} from "@/lib/demoData";
import { getSupabaseClient } from "@/lib/supabase";
import { getDataMode, hasSupabaseConfig, isLiveMode } from "@/lib/dataMode";
import type {
  ActivityFeedItem,
  AdminRoleItem,
  AgencyItem,
  AlertsCenterItem,
  AnalyticsPlatformBreakdown,
  AuditTimelineItem,
  DashboardMetrics,
  DispatcherStatusItem,
  DispatchMetrics,
  DispatchQueueItem,
  FranchiseMetrics,
  NotificationCenterItem,
  OrganizationItem,
  SystemHealthItem,
  SystemMetrics,
} from "@/lib/types";

export const DATA_MODE = getDataMode();
export const isDemoMode = DATA_MODE === "demo";

export type DataSourceStatus = {
  mode: "demo" | "live";
  source: "demo" | "live";
  label: string;
};

export type DatasetTelemetryKey = keyof typeof TABLES;

export type DatasetSourceStatus = {
  key: DatasetTelemetryKey;
  label: string;
  table: string;
  mode: "demo" | "live";
  source: "demo" | "live";
  reason?: string;
};

export type SourcedData<T> = {
  data: T;
  status: DatasetSourceStatus;
};

export type DatasetTelemetryEvent = DatasetSourceStatus & {
  timestamp: string;
};

type ApplicationSummary = {
  id: string;
  name: string;
};

type DbRow = Record<string, unknown>;

const TABLES = {
  applications: "apc_applications",
  dashboardMetrics: "apc_dashboard_metrics",
  dispatchMetrics: "apc_dispatch_metrics",
  systemMetrics: "apc_system_metrics",
  activityFeed: "apc_activity_feed",
  alertsCenter: "apc_alerts_center",
  notificationCenter: "apc_notification_center",
  analyticsPlatformBreakdown: "apc_analytics_platform_breakdown",
  dispatchQueue: "apc_dispatch_queue",
  dispatcherStatus: "apc_dispatcher_status",
  dispatchIncidents: "apc_dispatch_incidents",
  systemHealth: "apc_system_health",
  organizations: "apc_organizations",
  adminRoles: "apc_admin_roles",
  auditTimeline: "apc_audit_timeline",
  agencies: "apc_agencies",
  franchiseMetrics: "apc_franchise_metrics",
} as const;

export const DATASET_TELEMETRY_KEYS = Object.keys(TABLES) as DatasetTelemetryKey[];

export const DATASET_LABELS: Record<DatasetTelemetryKey, string> = {
  applications: "Applications",
  dashboardMetrics: "Dashboard Metrics",
  dispatchMetrics: "Dispatch Metrics",
  systemMetrics: "System Metrics",
  activityFeed: "Activity Feed",
  alertsCenter: "Alerts Center",
  notificationCenter: "Notifications",
  analyticsPlatformBreakdown: "Platform Breakdown",
  dispatchQueue: "Dispatch Queue",
  dispatcherStatus: "Dispatcher Status",
  dispatchIncidents: "Dispatch Incidents",
  systemHealth: "System Health",
  organizations: "Organizations",
  adminRoles: "Admin Roles",
  auditTimeline: "Audit Timeline",
  agencies: "Agencies",
  franchiseMetrics: "Franchise Metrics",
};

const TELEMETRY_EVENTS_TABLE = "apc_dataset_telemetry_events";

const DATASET_TELEMETRY_HISTORY_LIMIT = 50;
const datasetTelemetryHistory: Partial<Record<DatasetTelemetryKey, DatasetTelemetryEvent[]>> = {};

const LOW = "Low" as const;
const MEDIUM = "Medium" as const;
const HIGH = "High" as const;

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asAlertSeverity(value: unknown) {
  const normalized = asString(value, LOW).toLowerCase();
  if (normalized === "high") return HIGH;
  if (normalized === "medium") return MEDIUM;
  return LOW;
}

function asOperationalStatus(value: unknown): "Operational" | "Monitoring" {
  const normalized = asString(value, "Operational").toLowerCase();
  return normalized === "monitoring" ? "Monitoring" : "Operational";
}

function asPlatformHealthStatus(value: unknown): "Healthy" | "Monitoring" {
  const normalized = asString(value, "Healthy").toLowerCase();
  return normalized === "monitoring" ? "Monitoring" : "Healthy";
}

function asAgencyStatus(value: unknown): "Active" | "Pending" {
  const normalized = asString(value, "Active").toLowerCase();
  return normalized === "pending" ? "Pending" : "Active";
}

function canUseLiveMode() {
  return isLiveMode() && hasSupabaseConfig() && Boolean(getSupabaseClient());
}

function liveFallbackReason() {
  if (!isLiveMode()) {
    return "Live mode disabled by APC_DATA_MODE";
  }

  if (!hasSupabaseConfig()) {
    return "Supabase environment variables are missing";
  }

  return "Supabase client is unavailable";
}

async function canReadLiveTable(tableName: string) {
  const client = getSupabaseClient();
  if (!client) {
    return false;
  }

  const { error } = await client
    .from(tableName)
    .select("*", { head: true, count: "exact" })
    .limit(1);

  return !error;
}

function recordDatasetTelemetry(status: DatasetSourceStatus) {
  const previousEvent = datasetTelemetryHistory[status.key]?.[0];
  if (
    previousEvent &&
    previousEvent.source === status.source &&
    previousEvent.reason === status.reason &&
    previousEvent.mode === status.mode
  ) {
    return;
  }

  const event: DatasetTelemetryEvent = {
    ...status,
    timestamp: new Date().toISOString(),
  };

  const history = datasetTelemetryHistory[status.key] ?? [];
  history.unshift(event);
  datasetTelemetryHistory[status.key] = history.slice(0, DATASET_TELEMETRY_HISTORY_LIMIT);

  void persistDatasetTelemetryEvent(event);
}

async function persistDatasetTelemetryEvent(event: DatasetTelemetryEvent) {
  const client = getSupabaseClient();
  if (!client || !isLiveMode() || !hasSupabaseConfig()) {
    return;
  }

  try {
    await client.from(TELEMETRY_EVENTS_TABLE).insert({
      dataset_key: event.key,
      dataset_label: event.label,
      table_name: event.table,
      mode: event.mode,
      source: event.source,
      reason: event.reason ?? null,
      recorded_at: event.timestamp,
    });
  } catch {
    // Telemetry persistence is best-effort and must not impact runtime reads.
  }
}

export async function getPersistedDatasetTelemetryHistory(
  keys?: DatasetTelemetryKey[],
  limit = 50
): Promise<DatasetTelemetryEvent[]> {
  const client = getSupabaseClient();
  if (!client || !isLiveMode() || !hasSupabaseConfig()) {
    return [];
  }

  try {
    let query = client
      .from(TELEMETRY_EVENTS_TABLE)
      .select("dataset_key,dataset_label,table_name,mode,source,reason,recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (keys && keys.length > 0) {
      query = query.in("dataset_key", keys);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return (data as DbRow[])
      .map((row): DatasetTelemetryEvent | null => {
        const key = asString(row.dataset_key) as DatasetTelemetryKey;
        if (!(key in TABLES)) {
          return null;
        }

        return {
          key,
          label: asString(row.dataset_label, DATASET_LABELS[key]),
          table: asString(row.table_name, TABLES[key]),
          mode: asString(row.mode, "demo") === "live" ? "live" : "demo",
          source: asString(row.source, "demo") === "live" ? "live" : "demo",
          reason: asString(row.reason, "") || undefined,
          timestamp: asString(row.recorded_at, new Date().toISOString()),
        };
      })
      .filter((item): item is DatasetTelemetryEvent => item !== null);
  } catch {
    return [];
  }
}

export function getDatasetTelemetryHistory(
  keys?: DatasetTelemetryKey[]
): DatasetTelemetryEvent[] {
  const targetKeys = keys ?? (Object.keys(TABLES) as DatasetTelemetryKey[]);

  return targetKeys
    .flatMap((key) => datasetTelemetryHistory[key] ?? [])
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export function getDataSourceStatus(): DataSourceStatus {
  const mode = getDataMode();
  const liveReady = canUseLiveMode();

  if (mode === "live" && liveReady) {
    return {
      mode,
      source: "live",
      label: "Live Data Source",
    };
  }

  if (mode === "live" && !liveReady) {
    return {
      mode,
      source: "demo",
      label: "Live Requested - Demo Fallback",
    };
  }

  return {
    mode,
    source: "demo",
    label: "Demo Data Source",
  };
}

export async function getDatasetSourceStatuses(
  keys: DatasetTelemetryKey[]
): Promise<DatasetSourceStatus[]> {
  const mode = getDataMode();

  if (!canUseLiveMode()) {
    const reason = liveFallbackReason();

    const statuses: DatasetSourceStatus[] = keys.map(
      (key): DatasetSourceStatus => ({
        key,
        label: DATASET_LABELS[key],
        table: TABLES[key],
        mode,
        source: "demo",
        reason,
      })
    );

    statuses.forEach((status) => recordDatasetTelemetry(status));
    return statuses;
  }

  const probed = await Promise.all(
    keys.map(async (key) => {
      const table = TABLES[key];
      const liveAvailable = await canReadLiveTable(table);

      return {
        key,
        label: DATASET_LABELS[key],
        table,
        mode,
        source: liveAvailable ? "live" : "demo",
        reason: liveAvailable ? undefined : "Live query failed; using demo fallback",
      } satisfies DatasetSourceStatus;
    })
  );

  probed.forEach((status) => recordDatasetTelemetry(status));
  return probed;
}

async function withDemoFallbackSource<T>(
  key: DatasetTelemetryKey,
  demoData: T,
  liveResolver?: () => Promise<T>
): Promise<SourcedData<T>> {
  const mode = getDataMode();
  const table = TABLES[key];
  const label = DATASET_LABELS[key];

  if (!liveResolver || !canUseLiveMode()) {
    const status: DatasetSourceStatus = {
      key,
      label,
      table,
      mode,
      source: "demo",
      reason: liveFallbackReason(),
    };

    recordDatasetTelemetry(status);

    return {
      data: demoData,
      status,
    };
  }

  try {
    const data = await liveResolver();
    const status: DatasetSourceStatus = {
      key,
      label,
      table,
      mode,
      source: "live",
    };

    recordDatasetTelemetry(status);

    return {
      data,
      status,
    };
  } catch {
    const status: DatasetSourceStatus = {
      key,
      label,
      table,
      mode,
      source: "demo",
      reason: "Live query failed; using demo fallback",
    };

    recordDatasetTelemetry(status);

    return {
      data: demoData,
      status,
    };
  }
}

export async function getApplicationsWithSource(): Promise<SourcedData<ApplicationSummary[]>> {
  return withDemoFallbackSource(
    "applications",
    APP_REGISTRY.map((app) => ({
      id: app.id,
      name: app.name,
    })),
    async () => {
      const client = getSupabaseClient();

      if (!client) {
        return APP_REGISTRY.map((app) => ({ id: app.id, name: app.name }));
      }

      const { data, error } = await client.from(TABLES.applications).select("*");

      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "No application rows");
      }

      return (data as DbRow[]).map((row) => ({
        id: asString(row.id ?? row.app_id, "unknown_app"),
        name: asString(row.name ?? row.app_name, "Unknown Application"),
      }));
    }
  );
}

export async function getApplications(): Promise<ApplicationSummary[]> {
  return (await getApplicationsWithSource()).data;
}

export async function getDashboardMetricsWithSource(): Promise<SourcedData<DashboardMetrics>> {
  return withDemoFallbackSource("dashboardMetrics", dashboardMetrics, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client
      .from(TABLES.dashboardMetrics)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "No dashboard metrics row");
    }

    const row = data as DbRow;
    return {
      connectedApps: asNumber(row.connectedApps ?? row.connected_apps, dashboardMetrics.connectedApps),
      activeUsers: asNumber(row.activeUsers ?? row.active_users, dashboardMetrics.activeUsers),
      openCases: asNumber(row.openCases ?? row.open_cases, dashboardMetrics.openCases),
      resolvedCases: asNumber(row.resolvedCases ?? row.resolved_cases, dashboardMetrics.resolvedCases),
      organizations: asNumber(row.organizations, dashboardMetrics.organizations),
    };
  });
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return (await getDashboardMetricsWithSource()).data;
}

export async function getDispatchMetricsWithSource(): Promise<SourcedData<DispatchMetrics>> {
  return withDemoFallbackSource("dispatchMetrics", dispatchMetrics, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client
      .from(TABLES.dispatchMetrics)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "No dispatch metrics row");
    }

    const row = data as DbRow;
    return {
      activeCases: asNumber(row.activeCases ?? row.active_cases, dispatchMetrics.activeCases),
      pendingDispatches: asNumber(
        row.pendingDispatches ?? row.pending_dispatches,
        dispatchMetrics.pendingDispatches
      ),
      operatorsOnline: asNumber(
        row.operatorsOnline ?? row.operators_online,
        dispatchMetrics.operatorsOnline
      ),
      escalations: asNumber(row.escalations, dispatchMetrics.escalations),
    };
  });
}

export async function getDispatchMetrics(): Promise<DispatchMetrics> {
  return (await getDispatchMetricsWithSource()).data;
}

export async function getSystemMetricsWithSource(): Promise<SourcedData<SystemMetrics>> {
  return withDemoFallbackSource("systemMetrics", systemMetrics, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client
      .from(TABLES.systemMetrics)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "No system metrics row");
    }

    const row = data as DbRow;
    return {
      uptime: asString(row.uptime, systemMetrics.uptime),
      apiResponse: asString(row.apiResponse ?? row.api_response, systemMetrics.apiResponse),
      cpuUsage: asString(row.cpuUsage ?? row.cpu_usage, systemMetrics.cpuUsage),
      memoryUsage: asString(row.memoryUsage ?? row.memory_usage, systemMetrics.memoryUsage),
    };
  });
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  return (await getSystemMetricsWithSource()).data;
}

export async function getActivityFeedItemsWithSource(): Promise<SourcedData<ActivityFeedItem[]>> {
  return withDemoFallbackSource("activityFeed", activityFeedItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.activityFeed).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No activity feed rows");
    }

    return (data as DbRow[]).map((row) => ({
      title: asString(row.title, "Activity"),
      detail: asString(row.detail ?? row.description, ""),
      time: asString(row.time ?? row.created_at, "now"),
    }));
  });
}

export async function getActivityFeedItems(): Promise<ActivityFeedItem[]> {
  return (await getActivityFeedItemsWithSource()).data;
}

export async function getAlertsCenterItemsWithSource(): Promise<SourcedData<AlertsCenterItem[]>> {
  return withDemoFallbackSource("alertsCenter", alertsCenterItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.alertsCenter).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No alerts rows");
    }

    return (data as DbRow[]).map((row) => ({
      title: asString(row.title, "Alert"),
      severity: asAlertSeverity(row.severity),
      detail: asString(row.detail ?? row.description, ""),
    }));
  });
}

export async function getAlertsCenterItems(): Promise<AlertsCenterItem[]> {
  return (await getAlertsCenterItemsWithSource()).data;
}

export async function getNotificationCenterItemsWithSource(): Promise<SourcedData<NotificationCenterItem[]>> {
  return withDemoFallbackSource("notificationCenter", notificationCenterItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.notificationCenter).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No notifications rows");
    }

    return (data as DbRow[]).map((row) => ({
      title: asString(row.title, "Notification"),
      priority: asAlertSeverity(row.priority),
    }));
  });
}

export async function getNotificationCenterItems(): Promise<NotificationCenterItem[]> {
  return (await getNotificationCenterItemsWithSource()).data;
}

export async function getAnalyticsPlatformBreakdownWithSource(): Promise<
  SourcedData<AnalyticsPlatformBreakdown[]>
> {
  return withDemoFallbackSource(
    "analyticsPlatformBreakdown",
    analyticsPlatformBreakdown,
    async () => {
      const client = getSupabaseClient();
      if (!client) throw new Error("No client");

      const { data, error } = await client
        .from(TABLES.analyticsPlatformBreakdown)
        .select("*");

      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "No analytics platform rows");
      }

      return (data as DbRow[]).map((row) => ({
        name: asString(row.name, "Unknown Platform"),
        users: asNumber(row.users, 0),
        reports: asNumber(row.reports, 0),
        status: asPlatformHealthStatus(row.status),
      }));
    }
  );
}

export async function getAnalyticsPlatformBreakdown(): Promise<AnalyticsPlatformBreakdown[]> {
  return (await getAnalyticsPlatformBreakdownWithSource()).data;
}

export async function getDispatchQueueItemsWithSource(): Promise<SourcedData<DispatchQueueItem[]>> {
  return withDemoFallbackSource("dispatchQueue", dispatchQueueItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.dispatchQueue).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No dispatch queue rows");
    }

    return (data as DbRow[]).map((row) => ({
      id: asString(row.id, "case-unknown"),
      type: asString(row.type, "Unknown"),
      priority: asAlertSeverity(row.priority),
      status: asString(row.status, "Open"),
    }));
  });
}

export async function getDispatchQueueItems(): Promise<DispatchQueueItem[]> {
  return (await getDispatchQueueItemsWithSource()).data;
}

export async function getDispatcherStatusItemsWithSource(): Promise<
  SourcedData<DispatcherStatusItem[]>
> {
  return withDemoFallbackSource("dispatcherStatus", dispatcherStatusItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.dispatcherStatus).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No dispatcher status rows");
    }

    return (data as DbRow[]).map((row) => {
      const normalized = asString(row.status, "Online").toLowerCase();
      const status: DispatcherStatusItem["status"] =
        normalized === "busy" ? "Busy" : normalized === "offline" ? "Offline" : "Online";

      return {
        name: asString(row.name, "Dispatcher"),
        status,
      };
    });
  });
}

export async function getDispatcherStatusItems(): Promise<DispatcherStatusItem[]> {
  return (await getDispatcherStatusItemsWithSource()).data;
}

export async function getDispatchIncidentItemsWithSource(): Promise<SourcedData<string[]>> {
  return withDemoFallbackSource("dispatchIncidents", dispatchIncidentItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.dispatchIncidents).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No dispatch incidents rows");
    }

    return (data as DbRow[]).map((row) => asString(row.message ?? row.title, "Dispatch update"));
  });
}

export async function getDispatchIncidentItems(): Promise<string[]> {
  return (await getDispatchIncidentItemsWithSource()).data;
}

export async function getSystemHealthItemsWithSource(): Promise<SourcedData<SystemHealthItem[]>> {
  return withDemoFallbackSource("systemHealth", systemHealthItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.systemHealth).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No system health rows");
    }

    return (data as DbRow[]).map((row) => ({
      name: asString(row.name, "System"),
      status: asOperationalStatus(row.status),
      uptime: asString(row.uptime, "0%"),
    }));
  });
}

export async function getSystemHealthItems(): Promise<SystemHealthItem[]> {
  return (await getSystemHealthItemsWithSource()).data;
}

export async function getOrganizationItemsWithSource(): Promise<SourcedData<OrganizationItem[]>> {
  return withDemoFallbackSource("organizations", organizationItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.organizations).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No organization rows");
    }

    return (data as DbRow[]).map((row) => ({
      name: asString(row.name, "Organization"),
      members: asNumber(row.members, 0),
      status: asAgencyStatus(row.status),
    }));
  });
}

export async function getOrganizationItems(): Promise<OrganizationItem[]> {
  return (await getOrganizationItemsWithSource()).data;
}

export async function getAdminRoleItemsWithSource(): Promise<SourcedData<AdminRoleItem[]>> {
  return withDemoFallbackSource("adminRoles", adminRoleItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.adminRoles).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No admin role rows");
    }

    return (data as DbRow[]).map((row) => ({
      role: asString(row.role, "Role"),
      access: asString(row.access, ""),
      users: asNumber(row.users, 0),
    }));
  });
}

export async function getAdminRoleItems(): Promise<AdminRoleItem[]> {
  return (await getAdminRoleItemsWithSource()).data;
}

export async function getAuditTimelineItemsWithSource(): Promise<SourcedData<AuditTimelineItem[]>> {
  return withDemoFallbackSource("auditTimeline", auditTimelineItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.auditTimeline).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No audit timeline rows");
    }

    return (data as DbRow[]).map((row) => ({
      action: asString(row.action, "Activity"),
      user: asString(row.user, "System"),
      time: asString(row.time ?? row.created_at, "now"),
    }));
  });
}

export async function getAuditTimelineItems(): Promise<AuditTimelineItem[]> {
  return (await getAuditTimelineItemsWithSource()).data;
}

export async function getAgencyItemsWithSource(): Promise<SourcedData<AgencyItem[]>> {
  return withDemoFallbackSource("agencies", agencyItems, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client.from(TABLES.agencies).select("*");
    if (error || !data || data.length === 0) {
      throw new Error(error?.message || "No agency rows");
    }

    return (data as DbRow[]).map((row) => ({
      name: asString(row.name, "Agency"),
      status: asAgencyStatus(row.status),
    }));
  });
}

export async function getAgencyItems(): Promise<AgencyItem[]> {
  return (await getAgencyItemsWithSource()).data;
}

export async function getFranchiseMetricsWithSource(): Promise<SourcedData<FranchiseMetrics>> {
  return withDemoFallbackSource("franchiseMetrics", franchiseMetrics, async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error("No client");

    const { data, error } = await client
      .from(TABLES.franchiseMetrics)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "No franchise metrics row");
    }

    const row = data as DbRow;
    return {
      activeFranchises: asNumber(
        row.activeFranchises ?? row.active_franchises,
        franchiseMetrics.activeFranchises
      ),
      expansionRegions: asNumber(
        row.expansionRegions ?? row.expansion_regions,
        franchiseMetrics.expansionRegions
      ),
    };
  });
}

export async function getFranchiseMetrics(): Promise<FranchiseMetrics> {
  return (await getFranchiseMetricsWithSource()).data;
}
