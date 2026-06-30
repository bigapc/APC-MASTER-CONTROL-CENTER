import { MASTER_PLATFORM_CAPABILITIES } from "@/lib/config/masterPlatformCapabilities";
import { isLiveMode } from "@/lib/dataMode";
import { getRuntimeStatus } from "@/lib/runtimeStatus";

export type CapabilityRuntimeState = "ready" | "degraded" | "not-configured";

export type CapabilityReadiness = {
  id: string;
  title: string;
  domain: "operations" | "safety" | "education" | "finance";
  state: CapabilityRuntimeState;
  detail: string;
  missingRequirements: string[];
};

function isConfiguredUrl(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.startsWith("https://") || trimmed.startsWith("http://");
}

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}

function evaluateState(missingRequirements: string[], degradedReason?: string): CapabilityReadiness["state"] {
  if (missingRequirements.length > 0) {
    return "not-configured";
  }

  if (degradedReason) {
    return "degraded";
  }

  return "ready";
}

export async function getCapabilityReadiness() {
  const runtime = await getRuntimeStatus();
  const liveMode = isLiveMode();

  const byId: Record<string, CapabilityReadiness> = {
    "live-map-command": (() => {
      const missingRequirements = [
        ...(isConfiguredUrl(process.env.APC_MAP_PROVIDER_URL) ? [] : ["APC_MAP_PROVIDER_URL"]),
      ];
      const degradedReason = !liveMode
        ? "Running in demo mode; live map providers are not probed."
        : !runtime.platformsReachable
          ? "One or more connected platforms are unreachable for map overlay."
          : undefined;

      return {
        id: "live-map-command",
        title: "Live Command Map",
        domain: "operations",
        state: evaluateState(missingRequirements, degradedReason),
        detail: missingRequirements.length > 0
          ? "Map provider configuration is incomplete."
          : (degradedReason ?? "Map provider configured and platform overlays are reachable."),
        missingRequirements,
      };
    })(),
    "gps-tracker": (() => {
      const missingRequirements = [
        ...(isConfiguredUrl(process.env.APC_GPS_STREAM_URL) ? [] : ["APC_GPS_STREAM_URL"]),
        ...(hasValue(process.env.APC_GPS_STREAM_TOKEN) ? [] : ["APC_GPS_STREAM_TOKEN"]),
      ];
      const degradedReason = !liveMode ? "Running in demo mode; GPS stream validation is deferred." : undefined;

      return {
        id: "gps-tracker",
        title: "GPS Tracker",
        domain: "operations",
        state: evaluateState(missingRequirements, degradedReason),
        detail: missingRequirements.length > 0
          ? "GPS stream configuration is incomplete."
          : (degradedReason ?? "GPS stream credentials are configured."),
        missingRequirements,
      };
    })(),
    "alerts-command": (() => {
      const missingRequirements = [
        ...(runtime.platformsConfigured ? [] : ["Platform webhook secrets/service tokens"]),
      ];
      const degradedReason = !liveMode
        ? "Running in demo mode; alerts rely on simulated feeds."
        : !runtime.platformsReachable
          ? "One or more platform endpoints are unreachable for live alert ingestion."
          : undefined;

      return {
        id: "alerts-command",
        title: "Unified Alerts Command",
        domain: "safety",
        state: evaluateState(missingRequirements, degradedReason),
        detail: missingRequirements.length > 0
          ? "Alerts integration dependencies are incomplete."
          : (degradedReason ?? "Alert ingestion dependencies are configured and reachable."),
        missingRequirements,
      };
    })(),
    "school-historical-intelligence": (() => {
      const missingRequirements = [
        ...(isConfiguredUrl(process.env.APC_SCHOOL_DATA_SOURCE_URL) ? [] : ["APC_SCHOOL_DATA_SOURCE_URL"]),
        ...(hasValue(process.env.APC_SCHOOL_DATA_ACCESS_TOKEN) ? [] : ["APC_SCHOOL_DATA_ACCESS_TOKEN"]),
      ];
      const degradedReason = !liveMode ? "Running in demo mode; historical school data connectors are not validated." : undefined;

      return {
        id: "school-historical-intelligence",
        title: "Historical School Data Access",
        domain: "education",
        state: evaluateState(missingRequirements, degradedReason),
        detail: missingRequirements.length > 0
          ? "School data connector configuration is incomplete."
          : (degradedReason ?? "School data connector credentials are configured."),
        missingRequirements,
      };
    })(),
    "financial-analytics": (() => {
      const missingRequirements = [
        ...(isConfiguredUrl(process.env.APC_FINANCE_DATA_SOURCE_URL) ? [] : ["APC_FINANCE_DATA_SOURCE_URL"]),
        ...(hasValue(process.env.APC_FINANCE_DATA_ACCESS_TOKEN) ? [] : ["APC_FINANCE_DATA_ACCESS_TOKEN"]),
      ];
      const degradedReason = !liveMode ? "Running in demo mode; financial connectors are not validated." : undefined;

      return {
        id: "financial-analytics",
        title: "Financial Data and Analytics",
        domain: "finance",
        state: evaluateState(missingRequirements, degradedReason),
        detail: missingRequirements.length > 0
          ? "Financial analytics connector configuration is incomplete."
          : (degradedReason ?? "Financial analytics connector credentials are configured."),
        missingRequirements,
      };
    })(),
  };

  const capabilities = MASTER_PLATFORM_CAPABILITIES.map((capability) => byId[capability.id]);
  const readyCount = capabilities.filter((capability) => capability.state === "ready").length;
  const degradedCount = capabilities.filter((capability) => capability.state === "degraded").length;
  const notConfiguredCount = capabilities.filter((capability) => capability.state === "not-configured").length;

  return {
    capabilities,
    readyCount,
    degradedCount,
    notConfiguredCount,
    total: capabilities.length,
  };
}