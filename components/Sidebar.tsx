import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  AppWindow,
  BarChart3,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Map,
  Radio,
  Server,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/appConfig";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/apps", icon: AppWindow },
  { label: "Control Hubs", href: "/control-hubs", icon: ShieldCheck },
  { label: "Operations", href: "/operations", icon: Radio },
  { label: "Daily Checklist", href: "/checklist", icon: CheckSquare },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Staff Performance", href: "/staff-performance", icon: Trophy },
  { label: "Live Map", href: "/live-map", icon: Map },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Users", href: "/users", icon: Users },
  { label: "Backend Status", href: "/backend-status", icon: Server },
  { label: "Audit Logs", href: "/audit-logs", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

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
        {navItems.map((item) => {
          const Icon = item.icon;
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
