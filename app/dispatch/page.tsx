import {
  AlertTriangle,
  Clock,
  Radio,
  Shield,
  UserCheck,
} from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import {
  getDispatchIncidentItemsWithSource,
  getDispatcherStatusItemsWithSource,
  getDispatchMetricsWithSource,
  getDispatchQueueItemsWithSource,
} from "@/lib/supabaseAdapter";

export default async function DispatchPage() {
  const [dispatchMetricsResult, dispatchQueueItemsResult, dispatcherStatusItemsResult, dispatchIncidentItemsResult] =
    await Promise.all([
      getDispatchMetricsWithSource(),
      getDispatchQueueItemsWithSource(),
      getDispatcherStatusItemsWithSource(),
      getDispatchIncidentItemsWithSource(),
    ]);

  const dispatchMetrics = dispatchMetricsResult.data;
  const dispatchQueueItems = dispatchQueueItemsResult.data;
  const dispatcherStatusItems = dispatcherStatusItemsResult.data;
  const dispatchIncidentItems = dispatchIncidentItemsResult.data;
  const datasetStatuses = [
    dispatchMetricsResult.status,
    dispatchQueueItemsResult.status,
    dispatcherStatusItemsResult.status,
    dispatchIncidentItemsResult.status,
  ];

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">APC Dispatch Operations</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Dispatch Dataset Sources"
          statuses={datasetStatuses}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          Dispatch Command Center
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-300">
          Centralized dispatch oversight for SafeConnect, CommunitySafeConnect
          and CSC 2.0.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Mission</p>

          <p className="mt-2 text-lg font-semibold text-white">
            {APC_COMMAND.mission}
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="apc-card p-6">
          <Radio className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">Active Cases</p>
          <p className="mt-2 text-4xl font-black">{dispatchMetrics.activeCases}</p>
        </div>

        <div className="apc-card p-6">
          <Clock className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">
            Pending Dispatches
          </p>
          <p className="mt-2 text-4xl font-black">{dispatchMetrics.pendingDispatches}</p>
        </div>

        <div className="apc-card p-6">
          <UserCheck className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">
            Available Operators
          </p>
          <p className="mt-2 text-4xl font-black">{dispatchMetrics.operatorsOnline}</p>
        </div>

        <div className="apc-card p-6">
          <AlertTriangle className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">
            Open Escalations
          </p>
          <p className="mt-2 text-4xl font-black">{dispatchMetrics.escalations}</p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Live Dispatch Queue</h2>

        <div className="mt-6 space-y-4">
          {dispatchQueueItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-zinc-50 p-5">
              <div className="flex flex-wrap gap-4">
                <strong>{item.id}</strong>
                <span>{item.type}</span>
                <span>{item.priority}</span>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Dispatcher Status</h2>

          <div className="mt-5 space-y-3">
            {dispatcherStatusItems.map((dispatcher) => (
              <div key={dispatcher.name} className="rounded-xl bg-zinc-50 p-4">
                <p className="font-black">{dispatcher.name}</p>

                <p className="text-sm text-zinc-600">{dispatcher.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Live Incident Feed</h2>

          <div className="mt-5 space-y-3">
            {dispatchIncidentItems.map((incident) => (
              <div key={incident} className="rounded-xl bg-zinc-50 p-4">
                {incident}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="apc-card p-6">
        <div className="flex items-center gap-3">
          <Shield className="text-[#c1121f]" />

          <h2 className="text-2xl font-black">Future APC Franchise Network</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-zinc-50 p-4">Licensed Dispatch Partners</div>

          <div className="rounded-xl bg-zinc-50 p-4">Agency Dispatch Centers</div>

          <div className="rounded-xl bg-zinc-50 p-4">Regional Dispatch Networks</div>

          <div className="rounded-xl bg-zinc-50 p-4">APC Franchise Operations</div>
        </div>
      </section>
    </div>
  );
}
