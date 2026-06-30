import { APP_CONFIG } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { getAllReports, getAllUsers, getPlatformHealth } from "@/lib/integrations/platformConnector";

function summarizeUptime(healthyCount: number, totalCount: number) {
  if (totalCount === 0) {
    return "n/a";
  }

  const percentage = Math.round((healthyCount / totalCount) * 1000) / 10;
  return `${percentage}%`;
}

export default async function ExecutiveMetrics() {
  const [runtime, reports, users, platformHealth] = await Promise.all([
    getRuntimeStatus(),
    getAllReports(),
    getAllUsers(),
    getPlatformHealth(),
  ]);

  const openCases = reports.filter((report) => !["closed", "resolved"].includes(report.status.toLowerCase())).length;
  const resolvedCases = reports.length - openCases;
  const healthyPlatforms = platformHealth.filter((item) => item.status === "healthy").length;

  const metricCards = [
    { label: "Connected Apps", value: `${runtime.platforms.filter((platform) => platform.ready).length}/${runtime.platformCount}` },
    { label: "Reachable Apps", value: `${runtime.platforms.filter((platform) => platform.publicReachable && platform.adminReachable).length}/${runtime.platformCount}` },
    { label: "Active Users", value: users.length },
    { label: "Open Cases", value: openCases },
    { label: "Resolved Cases", value: resolvedCases },
    { label: "Platform Uptime", value: summarizeUptime(healthyPlatforms, APP_CONFIG.apps.length) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {metricCards.map((metric) => (
        <div key={metric.label} className="apc-card p-5">
          <h3>{metric.label}</h3>
          <p className="text-3xl font-black">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
