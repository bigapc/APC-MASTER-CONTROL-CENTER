import { APP_CONFIG } from "@/lib/appConfig";
import { getDataMode, hasSupabaseConfig } from "@/lib/dataMode";
import { getPlatformHealth } from "@/lib/integrations/platformConnector";
import { getLiveAuditLog, getLiveEvents, getLiveNotifications } from "@/lib/events/liveEventEmitter";
import { getAuditLogs } from "@/lib/supabase/audit";
import { getAcknowledgedOperationIds, isOperationAcknowledged } from "@/lib/services/operationsAcks";

export type DashboardActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type DashboardAlertItem = {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  detail: string;
};

export type DashboardNotificationItem = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  detail: string;
};

export type DashboardOperationTimelineItem = {
  id: string;
  action: string;
  actor: string;
  source: string;
  timestamp: string;
  time: string;
  acknowledged: boolean;
};

function pluralize(value: number, word: string) {
  return `${value} ${word}${value === 1 ? "" : "s"}`;
}

function formatRelativeTime(timestamp: string) {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return "recently";
  }

  const seconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${pluralize(minutes, "minute")} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${pluralize(hours, "hour")} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${pluralize(days, "day")} ago`;
}

function isConfiguredUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") {
    return false;
  }

  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

export async function getActivityFeed(limit = 6): Promise<DashboardActivityItem[]> {
  const inMemory = getLiveAuditLog();
  const persisted = await getAuditLogs(Math.max(limit * 2, 20));

  const seen = new Set<string>();
  const merged = [...inMemory, ...persisted]
    .filter((record) => {
      if (seen.has(record.id)) {
        return false;
      }
      seen.add(record.id);
      return true;
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, limit)
    .map((record) => ({
      id: record.id,
      title: record.action,
      detail: `Actor: ${record.actor}`,
      time: formatRelativeTime(record.timestamp),
    }));

  if (merged.length > 0) {
    return merged;
  }

  return [
    {
      id: "activity-demo-1",
      title: "Control center initialized",
      detail: "Actor: system",
      time: "just now",
    },
  ];
}

export function getNotificationFeed(limit = 6): DashboardNotificationItem[] {
  const notifications = getLiveNotifications()
    .slice(-limit)
    .reverse()
    .map((notification) => ({
      id: notification.id,
      title: notification.title,
      priority: (
        notification.level === "critical"
          ? "High"
          : notification.level === "warning"
            ? "Medium"
            : "Low"
      ) as DashboardNotificationItem["priority"],
      detail: notification.message,
    }));

  if (notifications.length > 0) {
    return notifications;
  }

  return [
    {
      id: "notification-demo-1",
      title: "No live notifications yet",
      priority: "Low",
      detail: "Notifications will appear here when connectors publish events.",
    },
  ];
}

export async function getAlertsFeed(limit = 6): Promise<DashboardAlertItem[]> {
  const alerts: DashboardAlertItem[] = [];
  const mode = getDataMode();
  const supabaseReady = hasSupabaseConfig();

  if (mode === "live" && !supabaseReady) {
    alerts.push({
      id: "alert-backend-config",
      title: "Live mode missing backend credentials",
      severity: "High",
      detail: "Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    });
  }

  for (const app of APP_CONFIG.apps) {
    if (!isConfiguredUrl(app.publicUrl) || !isConfiguredUrl(app.adminUrl)) {
      alerts.push({
        id: `alert-platform-url-${app.id}`,
        title: `${app.name} URL configuration is incomplete`,
        severity: "Medium",
        detail: "Set both public and admin platform URLs in environment variables.",
      });
    }
  }

  const health = await getPlatformHealth();
  for (const entry of health) {
    if (entry.status !== "healthy") {
      const appName = APP_CONFIG.apps.find((app) => app.id === entry.appId)?.name ?? entry.appId;
      alerts.push({
        id: `alert-health-${entry.appId}`,
        title: `${appName} health requires attention`,
        severity: "Medium",
        detail: `Current status is ${entry.status} with uptime ${entry.uptime}.`,
      });
    }
  }

  const liveNotifications = getLiveNotifications();
  for (const notification of liveNotifications.slice(-limit)) {
    if (notification.level === "warning" || notification.level === "critical") {
      alerts.push({
        id: `alert-notification-${notification.id}`,
        title: notification.title,
        severity: notification.level === "critical" ? "High" : "Medium",
        detail: notification.message,
      });
    }
  }

  const deduped = alerts.filter(
    (alert, index, all) => all.findIndex((item) => item.id === alert.id) === index
  );

  if (deduped.length > 0) {
    return deduped.slice(0, limit);
  }

  return [
    {
      id: "alert-ok-1",
      title: "No active critical alerts",
      severity: "Low",
      detail: "Platform connectors and backend configuration are stable.",
    },
  ];
}

export async function getOperationsTimeline(limit = 12): Promise<DashboardOperationTimelineItem[]> {
  const events = getLiveEvents()
    .filter((event) => event.type === "audit" || event.type === "notification")
    .map((event) => ({
      id: event.id,
      action: event.type === "notification" ? "notification:emitted" : "audit:event",
      actor: event.type === "notification" ? "system" : "operator",
      source: event.source,
      timestamp: event.timestamp,
    }));

  const inMemoryAudit = getLiveAuditLog().map((record) => ({
    id: record.id,
    action: record.action,
    actor: record.actor,
    source: "apc_control_center",
    timestamp: record.timestamp,
  }));

  const persistedAudit = await getAuditLogs(Math.max(limit * 2, 20));
  const persisted = persistedAudit.map((record) => ({
    id: record.id,
    action: record.action,
    actor: record.actor,
    source: record.source ?? "apc",
    timestamp: record.timestamp,
  }));

  const acked = new Set(getAcknowledgedOperationIds());

  const merged = [...events, ...inMemoryAudit, ...persisted]
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      time: formatRelativeTime(entry.timestamp),
      acknowledged: acked.has(entry.id) || isOperationAcknowledged(entry.id),
    }));

  if (merged.length > 0) {
    return merged;
  }

  return [
    {
      id: "operations-demo-1",
      action: "operations:initialized",
      actor: "system",
      source: "apc_control_center",
      timestamp: new Date().toISOString(),
      time: "just now",
      acknowledged: false,
    },
  ];
}
