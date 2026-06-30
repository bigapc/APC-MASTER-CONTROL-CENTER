export type CapabilityStatus = "active" | "in-progress" | "planned";

export type PlatformCapability = {
  id: string;
  title: string;
  domain: "operations" | "safety" | "education" | "finance";
  description: string;
  status: CapabilityStatus;
  dataSources: string[];
};

export const MASTER_PLATFORM_CAPABILITIES: PlatformCapability[] = [
  {
    id: "live-map-command",
    title: "Live Command Map",
    domain: "operations",
    description: "Unified live map view for APC command oversight across all connected platforms.",
    status: "in-progress",
    dataSources: ["Platform geolocation streams", "Dispatch incidents", "Operational events"],
  },
  {
    id: "gps-tracker",
    title: "GPS Tracker",
    domain: "operations",
    description: "GPS location and movement monitoring for field teams, units, and operational assets.",
    status: "planned",
    dataSources: ["Telemetry beacons", "Mobile app coordinates", "Vehicle/device trackers"],
  },
  {
    id: "alerts-command",
    title: "Unified Alerts Command",
    domain: "safety",
    description: "Real-time critical, warning, and info alert stream with escalation and audit trail.",
    status: "active",
    dataSources: ["Webhook alerts", "Manual operator actions", "System health monitors"],
  },
  {
    id: "school-historical-intelligence",
    title: "Historical School Data Access",
    domain: "education",
    description: "Controlled access to archived school records for trend analysis and operational planning.",
    status: "planned",
    dataSources: ["School archives", "Incident history", "Attendance and intervention records"],
  },
  {
    id: "financial-analytics",
    title: "Financial Data and Analytics",
    domain: "finance",
    description: "Financial oversight for cost trends, resource allocation, and executive analytics.",
    status: "planned",
    dataSources: ["Accounting exports", "Budget systems", "Operational cost telemetry"],
  },
];

export function getCapabilityCounts() {
  const active = MASTER_PLATFORM_CAPABILITIES.filter((item) => item.status === "active").length;
  const inProgress = MASTER_PLATFORM_CAPABILITIES.filter((item) => item.status === "in-progress").length;
  const planned = MASTER_PLATFORM_CAPABILITIES.filter((item) => item.status === "planned").length;

  return {
    total: MASTER_PLATFORM_CAPABILITIES.length,
    active,
    inProgress,
    planned,
  };
}