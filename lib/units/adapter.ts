import { APC_UNITS } from "@/lib/apcUnits";
import type { UnitDirectorySnapshot } from "./types";

export interface UnitDirectoryAdapter {
  readonly status: UnitDirectorySnapshot["sourceStatus"];
  listUnits(): Promise<UnitDirectorySnapshot["units"]>;
}

export const localUnitDirectoryAdapter: UnitDirectoryAdapter = {
  status: "LOCAL_DEVELOPMENT",
  async listUnits() { return APC_UNITS; },
};

export function getUnitDirectoryAdapter(): UnitDirectoryAdapter {
  return localUnitDirectoryAdapter;
}

export async function getUnitDirectorySnapshot(): Promise<UnitDirectorySnapshot> {
  const adapter = getUnitDirectoryAdapter();
  return { units: await adapter.listUnits(), sourceStatus: adapter.status };
}