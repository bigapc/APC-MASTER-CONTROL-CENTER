import Link from "next/link";
import {
  Activity,
  AppWindow,
  BarChart3,
  Building2,
  KeyRound,
  LayoutDashboard,
  Landmark,
  Network,
  Radio,
  Shield,
  Server,
  Settings,
  Users,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/appConfig";
import { SIDEBAR_LINKS } from "@/lib/navigation";

const iconByLabel = {
  Dashboard: LayoutDashboard,
  Applications: AppWindow,
  Analytics: BarChart3,
  Dispatch: Radio,
  "System Health": Server,
  Organizations: Building2,
  "Admin Roles": KeyRound,
  "Audit Logs": Shield,
  Telemetry: Activity,
  "Agency Management": Landmark,
  "Franchise Network": Network,
  Settings: Settings,
  Users: Users,
} as const;

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-80 border-r border-white/10 bg-[#070707] text-white">
      <div className="border-b border-white/10 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1121f] shadow-lg shadow-red-950/40">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide">APC Control</h1>
            <p className="text-sm text-zinc-400">Master Command Center</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Mission
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-200">
            {APP_CONFIG.mission}.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-xs font-bold text-red-100">
            Owner: {APP_CONFIG.ownerName}
          </p>
          <p className="mt-1 text-xs text-red-100/80">{APP_CONFIG.ownerEmail}</p>
        </div>
      </div>

      <nav className="space-y-1.5 p-4">
        {SIDEBAR_LINKS.map((item) => {
          const Icon = iconByLabel[item.label as keyof typeof iconByLabel] ?? Activity;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={18} className="text-red-400" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
