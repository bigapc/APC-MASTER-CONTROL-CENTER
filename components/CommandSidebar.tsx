"use client";

import Link from "next/link";

const links = [
  "/dashboard",
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
      <div className="p-6">
        <h2 className="text-2xl font-black">
          APC
        </h2>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => (
          <Link
            key={link}
            href={link}
            className="block rounded-xl p-3 hover:bg-zinc-900"
          >
            {link}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
