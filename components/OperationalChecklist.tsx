import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { getActivityFeed, getAlertsFeed, getNotificationFeed } from "@/lib/dashboard/liveFeeds";

type ChecklistItem = {
  key: string;
  label: string;
  complete: boolean;
  detail: string;
};

export default async function OperationalChecklist() {
  const [runtime, activity, alerts] = await Promise.all([
    getRuntimeStatus(),
    getActivityFeed(10),
    getAlertsFeed(10),
  ]);
  const notifications = getNotificationFeed(10);

  const highAlerts = alerts.filter((item) => item.severity === "High").length;

  const checklist: ChecklistItem[] = [
    {
      key: "runtime-mode",
      label: "Runtime mode confirmed",
      complete: runtime.liveRequested ? runtime.missingBackendEnvVars.length === 0 : true,
      detail: runtime.label,
    },
    {
      key: "platform-urls",
      label: "Platform URL configuration",
      complete: runtime.platformsConfigured,
      detail: runtime.platformsConfigured
        ? "All platform URLs configured"
        : "One or more platform URLs are missing",
    },
    {
      key: "platform-reachability",
      label: "Platform endpoint reachability",
      complete: runtime.platformsReachable,
      detail: runtime.platformsReachable
        ? "All platform endpoints reachable"
        : "Pending connectivity or unreachable endpoints",
    },
    {
      key: "alerts",
      label: "High-priority alerts triaged",
      complete: highAlerts === 0,
      detail: highAlerts === 0 ? "No high-priority alerts" : `${highAlerts} high-priority alert(s) active`,
    },
    {
      key: "notifications",
      label: "Notification channel active",
      complete: notifications.length > 0,
      detail: `${notifications.length} notification signal(s) available`,
    },
    {
      key: "activity",
      label: "Operational activity recorded",
      complete: activity.length > 0,
      detail: `${activity.length} activity event(s) observed`,
    },
  ];

  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Daily Operations Checklist
      </h2>

      <p className="mt-2 text-sm text-zinc-600">
        Items update from runtime status, connector probes, and live event feeds.
      </p>

      <div className="mt-5 space-y-3">
        {checklist.map((item) => (
          <div key={item.key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-zinc-900">{item.label}</p>
              <span className={`apc-status ${item.complete ? "apc-status-green" : "apc-status-yellow"}`}>
                {item.complete ? "Complete" : "Action Needed"}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
