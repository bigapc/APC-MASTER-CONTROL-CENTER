import { DEMO_ALERTS } from "@/lib/appConfig";
import { AlertTriangle, Bell, ShieldAlert } from "lucide-react";

function priorityClass(priority: string) {
  if (priority === "High") return "apc-status apc-status-red";
  if (priority === "Medium") return "apc-status apc-status-yellow";
  return "apc-status apc-status-green";
}

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Notification Center</div>
        <h1 className="mt-4 text-4xl font-black text-white">Alerts & Notifications</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Monitor high-priority backend, operations, user-role, and platform notifications from one APC alert center.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6"><ShieldAlert className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">High Priority</p><p className="mt-3 text-4xl font-black">1</p></div>
        <div className="apc-card p-6"><Bell className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Total Alerts</p><p className="mt-3 text-4xl font-black">3</p></div>
        <div className="apc-card p-6"><AlertTriangle className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Needs Review</p><p className="mt-3 text-4xl font-black">1</p></div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Alert Queue</h2>
        <div className="mt-6 space-y-4">
          {DEMO_ALERTS.map((alert) => (
            <div key={alert.title} className="rounded-2xl border border-black/5 bg-zinc-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-black text-zinc-950">{alert.title}</p>
                  <p className="mt-1 text-sm font-bold text-[#c1121f]">{alert.app}</p>
                  <p className="mt-3 leading-7 text-zinc-600">{alert.message}</p>
                </div>
                <span className={priorityClass(alert.priority)}>{alert.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
