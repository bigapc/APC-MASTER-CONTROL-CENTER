"use client";

import Link from "next/link";

const links = [
  "/dashboard",
  "/executive-command",
  "/apc-ai",
  "/academy",
  "/work",
  "/incidents",
  "/gateway",
  "/access-management",
  "/access-audit",
  "/governance",
  "/organization",
  "/personnel",
  "/units",
  "/integrations",
  "/operations",
  "/communications",
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
            {link === "/executive-command"
              ? "Executive Command"
              : link === "/apc-ai"
                ? "APC AI"
                : link === "/academy"
                  ? "APC Academy"
                  : link === "/work"
                    ? "Work Management"
                    : link === "/incidents"
                      ? "Incident Command"
                      : link === "/gateway"
                        ? "Integration Gateway"
                        : link === "/access-management"
                          ? "Access Management"
                          : link === "/access-audit"
                            ? "Access Audit"
                            : link === "/governance"
                              ? "Governance"
                  : link === "/organization"
                    ? "Organization"
                    : link === "/personnel"
                      ? "Personnel"
                : link === "/units"
                  ? "APC Units"
                  : link === "/integrations"
                    ? "Integrations"
                    : link === "/operations"
                      ? "Operations"
                      : link === "/communications"
                        ? "Communications"
                        : link}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
