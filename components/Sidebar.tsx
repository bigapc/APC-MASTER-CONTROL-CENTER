import Link from "next/link";
import {
  LayoutDashboard,
  AppWindow,
  FileText,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Apps",
    href: "/apps",
    icon: AppWindow,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-72 border-r bg-slate-950 text-white">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-xl font-bold">APC Control</h1>
        <p className="mt-1 text-sm text-slate-400">Master monitoring center</p>
      </div>

      <nav className="space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}