"use client";

import Link from "next/link";

const links = [
  "/dashboard",
  "/executive-command",
  "/admin-roles",
  "/apps",
  "/dispatch",
  "/analytics",
  "/organizations",
  "/audit-logs",
  "/settings",
];

export default function CommandSidebar() {
  return (
    <aside className="w-72 bg-black text-white">
      <div className="border-b border-white/10 p-6">
        <h2 className="text-2xl font-black tracking-tight">APC</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#c1121f]">
          Master Control
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => (
          <Link
            key={link}
            href={link}
            className="block rounded-xl p-3 hover:bg-zinc-900"
          >
            {link === "/executive-command" ? "Executive Command" : link}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
