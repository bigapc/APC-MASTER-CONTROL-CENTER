import {
  Activity,
  AlertTriangle,
  Building2,
  Shield,
  Users,
  Radio,
  TrendingUp,
} from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import {
  getAnalyticsPlatformBreakdownWithSource,
  getDashboardMetricsWithSource,
  getDispatchMetricsWithSource,
} from "@/lib/supabaseAdapter";

export default async function AnalyticsPage() {
  const [dashboardMetricsResult, dispatchMetricsResult, analyticsPlatformBreakdownResult] =
    await Promise.all([
      getDashboardMetricsWithSource(),
      getDispatchMetricsWithSource(),
      getAnalyticsPlatformBreakdownWithSource(),
    ]);

  const dashboardMetrics = dashboardMetricsResult.data;
  const dispatchMetrics = dispatchMetricsResult.data;
  const analyticsPlatformBreakdown = analyticsPlatformBreakdownResult.data;
  const datasetStatuses = [
    dashboardMetricsResult.status,
    dispatchMetricsResult.status,
    analyticsPlatformBreakdownResult.status,
  ];

  const stats = [
    {
      title: "Connected Applications",
      value: `${dashboardMetrics.connectedApps}`,
      icon: Activity,
    },
    {
      title: "Total Reports",
      value: `${dashboardMetrics.resolvedCases + dashboardMetrics.openCases}`,
      icon: TrendingUp,
    },
    {
      title: "Active Users",
      value: `${dashboardMetrics.activeUsers}`,
      icon: Users,
    },
    {
      title: "Open Cases",
      value: `${dashboardMetrics.openCases}`,
      icon: AlertTriangle,
    },
    {
      title: "Resolved Cases",
      value: `${dashboardMetrics.resolvedCases}`,
      icon: Shield,
    },
    {
      title: "Organizations",
      value: `${dashboardMetrics.organizations}`,
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Executive Analytics Center</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Analytics Dataset Sources"
          statuses={datasetStatuses}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          APC Analytics Command Center
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-300">
          Unified analytics across SafeConnect, CommunitySafeConnect and CSC 2.0.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-400">
            Mission Statement
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {APC_COMMAND.mission}
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="apc-card p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-500">{item.title}</p>

                <Icon className="text-[#c1121f]" />
              </div>

              <p className="mt-4 text-4xl font-black">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="apc-card p-6">
        <div className="flex items-center gap-3">
          <Radio className="text-[#c1121f]" />
          <h2 className="text-2xl font-black">Connected Platforms</h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {analyticsPlatformBreakdown.map((platform) => (
            <div key={platform.name} className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="text-xl font-black">{platform.name}</h3>

              <div className="mt-4 space-y-2 text-sm">
                <p>Users: {platform.users}</p>
                <p>Reports: {platform.reports}</p>
                <p>Status: {platform.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="apc-card p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-[#c1121f]" />
            <h2 className="text-2xl font-black">Dispatcher Metrics</h2>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-zinc-50 p-4">
              Average Response Time: 4.2 min
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">
              Assigned Cases: {dispatchMetrics.activeCases + dispatchMetrics.pendingDispatches}
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">
              Escalations: {dispatchMetrics.escalations}
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">
              Resolved Today: {dashboardMetrics.resolvedCases - 88}
            </div>
          </div>
        </div>

        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Future Growth Metrics</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-zinc-50 p-4">
              Partner Organizations: {dashboardMetrics.organizations}
            </div>

            <div className="rounded-xl bg-zinc-50 p-4">Agency Accounts: 3</div>

            <div className="rounded-xl bg-zinc-50 p-4">Franchise Locations: 0</div>

            <div className="rounded-xl bg-zinc-50 p-4">Expansion Regions: 4</div>
          </div>
        </div>
      </section>
    </div>
  );
}
