import {
  Activity,
  Database,
  Filter,
  History,
  Shield,
} from "lucide-react";
import DataSourceBadge from "@/components/DataSourceBadge";
import {
  DATASET_LABELS,
  DATASET_TELEMETRY_KEYS,
  getDatasetSourceStatuses,
  getDatasetTelemetryHistory,
  getPersistedDatasetTelemetryHistory,
  type DatasetTelemetryEvent,
  type DatasetTelemetryKey,
} from "@/lib/supabaseAdapter";

type TelemetrySearchParams = {
  dataset?: string;
  source?: string;
  window?: string;
  limit?: string;
};

const WINDOW_OPTIONS = [
  { label: "Last 1 Hour", value: "1h", ms: 60 * 60 * 1000 },
  { label: "Last 24 Hours", value: "24h", ms: 24 * 60 * 60 * 1000 },
  { label: "Last 7 Days", value: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "Last 30 Days", value: "30d", ms: 30 * 24 * 60 * 60 * 1000 },
] as const;

function getWindowMs(value: string) {
  return WINDOW_OPTIONS.find((item) => item.value === value)?.ms ?? WINDOW_OPTIONS[1].ms;
}

function isDatasetKey(value: string): value is DatasetTelemetryKey {
  return DATASET_TELEMETRY_KEYS.includes(value as DatasetTelemetryKey);
}

function mergeAndSortEvents(
  inMemoryEvents: DatasetTelemetryEvent[],
  persistedEvents: DatasetTelemetryEvent[]
) {
  const deduped = new Map<string, DatasetTelemetryEvent>();

  for (const event of [...persistedEvents, ...inMemoryEvents]) {
    const key = `${event.key}:${event.timestamp}:${event.source}:${event.mode}`;
    if (!deduped.has(key)) {
      deduped.set(key, event);
    }
  }

  return [...deduped.values()].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
  );
}

export default async function TelemetryPage({
  searchParams,
}: {
  searchParams?: Promise<TelemetrySearchParams> | TelemetrySearchParams;
}) {
  const params = await Promise.resolve(searchParams ?? {});

  const selectedDataset =
    typeof params.dataset === "string" && isDatasetKey(params.dataset)
      ? params.dataset
      : "all";

  const selectedSource =
    params.source === "demo" || params.source === "live" ? params.source : "all";

  const selectedWindow =
    typeof params.window === "string" && WINDOW_OPTIONS.some((opt) => opt.value === params.window)
      ? params.window
      : "24h";

  const selectedLimit = Math.min(
    200,
    Math.max(10, Number.parseInt(params.limit ?? "50", 10) || 50)
  );

  const datasetKeys =
    selectedDataset === "all" ? DATASET_TELEMETRY_KEYS : [selectedDataset];

  const [currentStatuses, inMemoryEvents, persistedEvents] = await Promise.all([
    getDatasetSourceStatuses(datasetKeys),
    Promise.resolve(getDatasetTelemetryHistory(datasetKeys)),
    getPersistedDatasetTelemetryHistory(datasetKeys, 400),
  ]);

  const mergedEvents = mergeAndSortEvents(inMemoryEvents, persistedEvents);
  const cutoff = Date.now() - getWindowMs(selectedWindow);

  const filteredEvents = mergedEvents
    .filter((event) => Date.parse(event.timestamp) >= cutoff)
    .filter((event) => (selectedSource === "all" ? true : event.source === selectedSource))
    .slice(0, selectedLimit);

  const liveCount = filteredEvents.filter((event) => event.source === "live").length;
  const demoCount = filteredEvents.filter((event) => event.source === "demo").length;
  const exportQuery = new URLSearchParams({
    dataset: selectedDataset,
    source: selectedSource,
    window: selectedWindow,
    limit: String(selectedLimit),
  }).toString();

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Telemetry Audit</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <h1 className="mt-4 text-4xl font-black text-white">
          APC Dataset Telemetry Center
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-300">
          Audit live versus fallback behavior across datasets with persistent event history and runtime state.
        </p>

        <form className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-4">
          <label className="space-y-2 text-sm font-bold text-zinc-200">
            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
              <Filter size={14} />
              Dataset
            </span>
            <select
              name="dataset"
              defaultValue={selectedDataset}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="all">All Datasets</option>
              {DATASET_TELEMETRY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {DATASET_LABELS[key]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-bold text-zinc-200">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Source</span>
            <select
              name="source"
              defaultValue={selectedSource}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="all">All Sources</option>
              <option value="live">Live</option>
              <option value="demo">Demo</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-bold text-zinc-200">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Time Window</span>
            <select
              name="window"
              defaultValue={selectedWindow}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            >
              {WINDOW_OPTIONS.map((windowOption) => (
                <option key={windowOption.value} value={windowOption.value}>
                  {windowOption.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-bold text-zinc-200">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Rows</span>
            <input
              type="number"
              min={10}
              max={200}
              name="limit"
              defaultValue={selectedLimit}
              className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white"
            />
          </label>

          <div className="md:col-span-4 flex flex-wrap gap-3">
            <button type="submit" className="apc-button-primary">
              Apply Filters
            </button>
            <a href={`/telemetry/export?${exportQuery}`} className="apc-button-secondary">
              Export CSV
            </a>
          </div>
        </form>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6">
          <History className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Events Returned</p>
          <p className="mt-2 text-4xl font-black">{filteredEvents.length}</p>
        </div>

        <div className="apc-card p-6">
          <Activity className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Live Events</p>
          <p className="mt-2 text-4xl font-black">{liveCount}</p>
        </div>

        <div className="apc-card p-6">
          <Database className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Fallback Events</p>
          <p className="mt-2 text-4xl font-black">{demoCount}</p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="flex items-center gap-3 text-2xl font-black">
          <Shield className="text-[#c1121f]" />
          Current Dataset Source Status
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {currentStatuses.map((status) => (
            <div key={status.key} className="rounded-xl bg-zinc-50 p-4">
              <p className="font-black text-zinc-900">{status.label}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                {status.table}
              </p>
              <div className="mt-3">
                <span
                  className={
                    status.source === "live"
                      ? "apc-status apc-status-green"
                      : "apc-status apc-status-yellow"
                  }
                >
                  {status.source.toUpperCase()}
                </span>
              </div>
              {status.reason ? (
                <p className="mt-2 text-xs text-zinc-500">{status.reason}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Telemetry Event Timeline</h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <th className="py-3 pr-3">Timestamp</th>
                <th className="py-3 pr-3">Dataset</th>
                <th className="py-3 pr-3">Source</th>
                <th className="py-3 pr-3">Mode</th>
                <th className="py-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={`${event.key}-${event.timestamp}-${event.source}`} className="border-b border-zinc-100">
                  <td className="py-3 pr-3 text-zinc-700">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 pr-3 font-semibold text-zinc-900">{event.label}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={
                        event.source === "live"
                          ? "apc-status apc-status-green"
                          : "apc-status apc-status-yellow"
                      }
                    >
                      {event.source}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-zinc-700">{event.mode}</td>
                  <td className="py-3 text-zinc-600">{event.reason ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvents.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              No telemetry events found for the current filter combination.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
