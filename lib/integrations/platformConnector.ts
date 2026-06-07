// platformConnector.ts — THE SINGLE SWAP POINT
// Aggregates all real per-platform connectors. Replace a connector import to
// activate a new backend without changing any callers.
import type { PlatformHealth, PlatformReport, PlatformUser } from "./types";

// ── Real connectors (Phase 10) ────────────────────────────────────────────────
import { getSafeConnectReports, getSafeConnectUsers, getSafeConnectHealth } from "./connectors/safeconnect";
import { getCSCReports, getCSCUsers, getCSCHealth } from "./connectors/communitySafeConnect";
import { getCSC20Reports, getCSC20Users, getCSC20Health } from "./connectors/csc20";

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
  const [sc, csc, csc20] = await Promise.all([
    getSafeConnectHealth(),
    getCSCHealth(),
    getCSC20Health(),
  ]);
  return [sc, csc, csc20];
}
