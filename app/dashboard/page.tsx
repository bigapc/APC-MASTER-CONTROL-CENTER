import { APP_CONFIG } from "@/lib/appConfig";
import { Activity, AlertTriangle, FileText, Users } from "lucide-react";

const stats = [
  {
    label: "Total Apps",
    value: "3",
    icon: Activity,
  },
  {
    label: "Open Reports",
    value: "0",
    icon: FileText,
  },
  {
    label: "Active Users",
    value: "0",
    icon: Users,
  },
  {
    label: "System Alerts",
    value: "0",
    icon: AlertTriangle,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Armstrong Pack Company
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Master Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Unified monitoring for all APC safety platforms.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <Icon className="text-slate-400" size={20} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-slate-950">Connected Applications</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {APP_CONFIG.apps.map((app) => (
            <div key={app.id} className="rounded-2xl border p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-950">{app.name}</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {app.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{app.description}</p>
              <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs font-mono text-slate-700">
                app_id: {app.id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}