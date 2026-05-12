import { Radio, Siren, Users, MapPin, Clock, CheckCircle2 } from "lucide-react";

const operationCards = [
  { label: "Active Dispatches", value: "0", icon: Radio },
  { label: "Urgent Cases", value: "0", icon: Siren },
  { label: "Available Staff", value: "3", icon: Users },
  { label: "Service Zones", value: "3", icon: MapPin },
];

const queue = [
  { title: "SafeConnect exchange queue", status: "Ready", app: "SafeConnect" },
  { title: "Community reports review", status: "Ready", app: "CommunitySafeConnect" },
  { title: "CSC 2.0 dispatcher board", status: "Ready", app: "CSC 2.0" },
];

export default function OperationsPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Dispatcher Operations</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Operations Center</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Monitor dispatch readiness, urgent service queues, staff availability, and daily coordination across the APC safety network.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        {operationCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="apc-card p-6">
              <Icon className="text-[#c1121f]" />
              <p className="mt-4 text-sm font-bold text-zinc-500">{item.label}</p>
              <p className="mt-3 text-4xl font-black">{item.value}</p>
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
                <span className="apc-status apc-status-green">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="apc-card p-6">
          <h2 className="text-2xl font-black">Shift Readiness</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-zinc-50 p-4"><Clock className="text-[#c1121f]" /><p className="mt-3 font-black">Daily review pending</p><p className="mt-1 text-sm text-zinc-600">Confirm readiness before live operations.</p></div>
            <div className="rounded-2xl bg-zinc-50 p-4"><CheckCircle2 className="text-[#c1121f]" /><p className="mt-3 font-black">System shell active</p><p className="mt-1 text-sm text-zinc-600">Prepared for Supabase live records.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
