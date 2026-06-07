import Link from "next/link";

const quickActions = [
  {
    label: "Review Reports",
    href: "/reports",
    className: "rounded-xl bg-red-700 p-4 text-white",
  },
  {
    label: "Dispatch Center",
    href: "/dispatch",
    className: "rounded-xl bg-black p-4 text-white",
  },
  {
    label: "User Directory",
    href: "/users",
    className: "rounded-xl bg-zinc-800 p-4 text-white",
  },
  {
    label: "System Health",
    href: "/system-health",
    className: "rounded-xl bg-zinc-700 p-4 text-white",
  },
];

export default function QuickActionsPanel() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Quick Actions
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className={action.className}>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
