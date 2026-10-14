import type { APCUnit } from "@/lib/apcUnits";

export interface UnitDirectorySnapshot {
  units: readonly APCUnit[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}