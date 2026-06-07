import {
  getDatasetTelemetryHistory,
  getPersistedDatasetTelemetryHistory,
  getDatasetSourceStatuses,
  type DatasetSourceStatus,
  type DatasetTelemetryKey,
} from "@/lib/supabaseAdapter";

interface DatasetSourceListProps {
  datasets?: DatasetTelemetryKey[];
  statuses?: DatasetSourceStatus[];
  title?: string;
  className?: string;
}

export default async function DatasetSourceList({
  datasets,
  statuses,
  title = "Dataset Sources",
  className = "",
}: DatasetSourceListProps) {
  const resolvedStatuses = statuses ?? (datasets ? await getDatasetSourceStatuses(datasets) : []);
  const telemetryKeys = resolvedStatuses.map((status) => status.key);
  const [inMemoryEvents, persistedEvents] = await Promise.all([
    Promise.resolve(getDatasetTelemetryHistory(telemetryKeys)),
    getPersistedDatasetTelemetryHistory(telemetryKeys, 24),
  ]);

  const deduped = new Map<string, (typeof inMemoryEvents)[number]>();
  for (const event of [...inMemoryEvents, ...persistedEvents]) {
    const id = `${event.key}:${event.timestamp}:${event.source}:${event.mode}`;
    if (!deduped.has(id)) {
      deduped.set(id, event);
    }
  }

  const recentEvents = [...deduped.values()]
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, 6);

  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white/70 p-4 ${className}`.trim()}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{title}</p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {resolvedStatuses.map((status) => (
          <div key={status.key} className="rounded-xl bg-zinc-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-zinc-800">{status.label}</p>

              <span
                className={
                  status.source === "live"
                    ? "apc-status apc-status-green"
                    : "apc-status apc-status-yellow"
                }
              >
                {status.source}
              </span>
            </div>

            {status.reason ? (
              <p className="mt-2 text-xs text-zinc-500">{status.reason}</p>
            ) : null}
          </div>
        ))}
      </div>

      {recentEvents.length > 0 ? (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            Recent Source Events
          </p>

          <div className="mt-2 space-y-1">
            {recentEvents.map((event) => (
              <div
                key={`${event.key}-${event.timestamp}`}
                className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600"
              >
                <span className="font-semibold text-zinc-700">{event.label}</span>
                <span>{event.source.toUpperCase()}</span>
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
