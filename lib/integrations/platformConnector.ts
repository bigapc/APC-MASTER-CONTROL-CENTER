// platformConnector.ts — THE SINGLE SWAP POINT
// Aggregates all real per-platform connectors. Replace a connector import to
// activate a new backend without changing any callers.
import type { PlatformHealth, PlatformReport, PlatformUser } from "./types";
import { getRuntimeStatus } from "@/lib/runtimeStatus";

// ── Real connectors (Phase 10) ────────────────────────────────────────────────
import { getSafeConnectReports, getSafeConnectUsers } from "./connectors/safeconnect";
import { getCSCReports, getCSCUsers } from "./connectors/communitySafeConnect";
import { getCSC20Reports, getCSC20Users } from "./connectors/csc20";

// Dispatcher connector exposes full lifecycle — also consumed by dispatch API route.
export {
  getQueue as getDispatchQueue,
  getCaseById as getDispatchCaseById,
  assignCase as assignDispatchCase,
  escalateCase as escalateDispatchCase,
  closeCase as closeDispatchCase,
  getDispatcherHealth,
} from "./connectors/dispatcher";

// ── Aggregated read functions ─────────────────────────────────────────────────

export async function getAllReports(): Promise<PlatformReport[]> {
  const [sc, csc, csc20] = await Promise.all([
    getSafeConnectReports(),
    getCSCReports(),
    getCSC20Reports(),
  ]);
  return [...sc, ...csc, ...csc20];
}

export async function getAllUsers(): Promise<PlatformUser[]> {
  const [sc, csc, csc20] = await Promise.all([
    getSafeConnectUsers(),
    getCSCUsers(),
    getCSC20Users(),
  ]);
  return [...sc, ...csc, ...csc20];
}

export async function getPlatformHealth(): Promise<PlatformHealth[]> {
  const runtime = await getRuntimeStatus();
  const platformIds = ["safeconnect", "communitysafeconnect", "csc_2_0"] as const;

  return platformIds.map((appId) => {
    const platform = runtime.platforms.find((entry) => entry.id === appId);
    const reachable = platform?.publicReachable && platform.adminReachable;

    return {
      appId,
      status: reachable ? "healthy" : runtime.liveRequested ? "warning" : "monitoring",
      uptime: "n/a",
    };
  });
}
