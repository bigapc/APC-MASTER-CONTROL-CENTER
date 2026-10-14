import { Radio, Siren, Users, MapPin, Clock, CheckCircle2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import APCUnitStatusBoard from "@/components/APCUnitStatusBoard";
import { APC_UNITS } from "@/lib/apcUnits";

const operationCards = [
  { label: "Active Dispatches", value: "Integration Pending", icon: Radio },
  { label: "Urgent Cases", value: "Integration Pending", icon: Siren },
  { label: "Available Staff", value: "Integration Pending", icon: Users },
  { label: "Service Zones", value: "Integration Pending", icon: MapPin },
];

const queue = [
  { title: "SafeConnect exchange queue", status: "Integration Pending", app: "SafeConnect" },
  { title: "Community reports review", status: "Integration Pending", app: "CommunitySafeConnect" },
  { title: "CSC 2.0 dispatcher board", status: "Integration Pending", app: "CSC 2.0" },
];

export default function OperationsPage() {
  const statusSummary = [
    ["Development", APC_UNITS.filter((unit) => unit.status === "DEVELOPMENT").length],
    ["Integration Pending", APC_UNITS.filter((unit) => unit.status === "INTEGRATION_PENDING").length],
    ["Not Connected", APC_UNITS.filter((unit) => unit.integrationStatus === "NOT_CONNECTED").length],
  ];

  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Dispatcher Operations</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Operations Center</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Monitor dispatch readiness, urgent service queues, staff availability, and daily coordination across the APC safety network.
        </p>
      </section>

          <section className="grid gap-5 md:grid-cols-4">
            <div className="apc-card p-6">
              <p className="text-sm font-bold text-zinc-500">Total APC Units</p>
              <p className="mt-3 text-4xl font-black">{APC_UNITS.length}</p>
            </div>
            {statusSummary.map(([label, value]) => (
              <div key={label} className="apc-card p-6">
                <p className="text-sm font-bold text-zinc-500">Units {label}</p>
                <p className="mt-3 text-4xl font-black">{value}</p>
              </div>
            ))}
          </section>

      <section className="grid gap-5 md:grid-cols-4">
        {operationCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="apc-card p-6">
              <Icon className="text-[#c1121f]" />
              <p className="mt-4 text-sm font-bold text-zinc-500">{item.label}</p>
              <p className="mt-3 text-lg font-black">{item.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Operations Queue</h2>
          <div className="mt-5 space-y-4">
            {queue.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-zinc-50 p-5">
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.app}</p>
                </div>
                <span className="apc-status apc-status-yellow">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Shift Readiness</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-zinc-50 p-4"><Clock className="text-[#c1121f]" /><p className="mt-3 font-black">Daily review pending</p><p className="mt-1 text-sm text-zinc-600">Confirm readiness before live operations.</p></div>
            <div className="rounded-2xl bg-zinc-50 p-4"><CheckCircle2 className="text-[#c1121f]" /><p className="mt-3 font-black">No Live Monitoring Connection</p><p className="mt-1 text-sm text-zinc-600">Future service health will appear after approved monitoring is connected.</p></div>
          </div>
        </div>
      </section>

          <APCUnitStatusBoard compact />

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="apc-card p-6">
              <h2 className="text-2xl font-black">Future Alert Architecture</h2>
              <p className="mt-3 text-zinc-600">Integration alerts, service failures, and operational incidents will appear here after approved monitoring connections are configured.</p>
              <p className="mt-4 font-bold text-[#c1121f]">No Live Critical Alert Feed Connected</p>
            </div>
            <div className="apc-card p-6">
              <h2 className="text-2xl font-black">Development Status</h2>
              <p className="mt-3 text-zinc-600">The Operations Center shell is available for local development and future APC unit adapters.</p>
              <p className="mt-4 font-bold text-blue-700">LOCAL DEVELOPMENT</p>
            </div>
          </section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
