import { dashboardMetrics, systemMetrics } from "@/lib/demoData";

const metricCards = [
  { label: "Connected Apps", value: dashboardMetrics.connectedApps },
  { label: "Active Users", value: dashboardMetrics.activeUsers },
  { label: "Open Cases", value: dashboardMetrics.openCases },
  { label: "Resolved Cases", value: dashboardMetrics.resolvedCases },
  { label: "Organizations", value: dashboardMetrics.organizations },
  { label: "Uptime", value: systemMetrics.uptime },
];

export default function ExecutiveMetrics() {
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
