import {
  CheckCircle,
  Database,
  Server,
  Shield,
  Activity,
  Wifi,
} from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import {
  getApplicationsWithSource,
  getSystemHealthItemsWithSource,
  getSystemMetricsWithSource,
} from "@/lib/supabaseAdapter";

export default async function SystemHealthPage() {
  const [applicationsResult, systemHealthItemsResult, systemMetricsResult] = await Promise.all([
    getApplicationsWithSource(),
    getSystemHealthItemsWithSource(),
    getSystemMetricsWithSource(),
  ]);

  const applications = applicationsResult.data;
  const systemHealthItems = systemHealthItemsResult.data;
  const systemMetrics = systemMetricsResult.data;
  const datasetStatuses = [
    applicationsResult.status,
    systemHealthItemsResult.status,
    systemMetricsResult.status,
  ];

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">APC Infrastructure Monitoring</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Infrastructure Dataset Sources"
          statuses={datasetStatuses}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          System Health Command Center
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-300">
          Real-time monitoring for APC systems, applications, dispatch services,
          and backend infrastructure.
        </p>
        <p className="mt-4 max-w-3xl text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="apc-card p-6">
          <Server className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Systems Online</p>
          <p className="mt-2 text-4xl font-black">{applications.length}</p>
        </div>

        <div className="apc-card p-6">
          <Wifi className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Network Status</p>
          <p className="mt-2 text-4xl font-black">Stable</p>
        </div>

        <div className="apc-card p-6">
          <Database className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Databases</p>
          <p className="mt-2 text-4xl font-black">{systemMetrics.uptime}</p>
        </div>

        <div className="apc-card p-6">
          <Shield className="text-[#c1121f]" />
          <p className="mt-3 text-sm font-bold text-zinc-500">Security</p>
          <p className="mt-2 text-4xl font-black">Protected</p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Connected Platform Status</h2>

        <div className="mt-6 space-y-4">
          {systemHealthItems.map((system) => (
            <div key={system.name} className="rounded-2xl bg-zinc-50 p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-black">{system.name}</h3>

                  <p className="text-sm text-zinc-600">Uptime: {system.uptime}</p>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle
                    size={18}
                    className={
                      system.status === "Operational"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  />

                  <span className="font-bold">{system.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-[#c1121f]" />

          <h2 className="text-2xl font-black">Infrastructure Metrics</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-zinc-50 p-5">CPU Usage: {systemMetrics.cpuUsage}</div>

          <div className="rounded-xl bg-zinc-50 p-5">Memory Usage: {systemMetrics.memoryUsage}</div>

          <div className="rounded-xl bg-zinc-50 p-5">API Response: {systemMetrics.apiResponse}</div>
        </div>
      </section>
    </div>
  );
}
