import { NextRequest } from "next/server";
import {
  DATASET_TELEMETRY_KEYS,
  getDatasetTelemetryHistory,
  getPersistedDatasetTelemetryHistory,
  type DatasetTelemetryEvent,
  type DatasetTelemetryKey,
} from "@/lib/supabaseAdapter";

const WINDOW_OPTIONS = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
} as const;

function getWindowMs(value: string) {
  return WINDOW_OPTIONS[value as keyof typeof WINDOW_OPTIONS] ?? WINDOW_OPTIONS["24h"];
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

function csvEscape(value: string) {
  if (value.includes(",") || value.includes("\n") || value.includes("\"")) {
    return `"${value.replaceAll("\"", "\"\"")}"`;
  }

  return value;
}

export async function GET(request: NextRequest) {
  const datasetParam = request.nextUrl.searchParams.get("dataset") ?? "all";
  const sourceParam = request.nextUrl.searchParams.get("source") ?? "all";
  const windowParam = request.nextUrl.searchParams.get("window") ?? "24h";
  const limitParam = request.nextUrl.searchParams.get("limit") ?? "200";

  const selectedDataset = isDatasetKey(datasetParam) ? datasetParam : "all";
  const selectedSource = sourceParam === "live" || sourceParam === "demo" ? sourceParam : "all";
  const selectedLimit = Math.min(
    2000,
    Math.max(10, Number.parseInt(limitParam, 10) || 200)
  );

  const datasetKeys =
    selectedDataset === "all" ? DATASET_TELEMETRY_KEYS : [selectedDataset];

  const [inMemoryEvents, persistedEvents] = await Promise.all([
    Promise.resolve(getDatasetTelemetryHistory(datasetKeys)),
    getPersistedDatasetTelemetryHistory(datasetKeys, 4000),
  ]);

  const mergedEvents = mergeAndSortEvents(inMemoryEvents, persistedEvents);
  const cutoff = Date.now() - getWindowMs(windowParam);

  const filteredEvents = mergedEvents
    .filter((event) => Date.parse(event.timestamp) >= cutoff)
    .filter((event) => (selectedSource === "all" ? true : event.source === selectedSource))
    .slice(0, selectedLimit);

  const rows = [
    ["timestamp", "dataset_key", "dataset_label", "table", "source", "mode", "reason"],
    ...filteredEvents.map((event) => [
      event.timestamp,
      event.key,
      event.label,
      event.table,
      event.source,
      event.mode,
      event.reason ?? "",
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  const now = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `apc-telemetry-${now}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${fileName}`,
      "Cache-Control": "no-store",
    },
  });
}
