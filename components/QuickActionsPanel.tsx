"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const quickNavActions = [
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

const quickEventActions = [
  {
    label: "Emit Reports Review Event",
    action: "review_reports",
  },
  {
    label: "Emit Dispatch Sync Event",
    action: "sync_dispatch",
  },
  {
    label: "Run Platform Probe",
    action: "probe_platforms",
  },
  {
    label: "Broadcast Operations Notice",
    action: "broadcast_notice",
  },
] as const;

type QuickActionType = (typeof quickEventActions)[number]["action"];

export default function QuickActionsPanel() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function triggerAction(action: QuickActionType) {
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        });

        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setMessage(payload?.message ?? (response.ok ? "Action completed." : "Action failed."));

        if (response.ok) {
          router.refresh();
        }
      } catch {
        setMessage("Unable to trigger action right now.");
      }
    });
  }

  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Quick Actions
      </h2>

      <p className="mt-2 text-sm text-zinc-600">
        Run operational actions and generate live events that appear in activity, alerts, and notifications.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {quickEventActions.map((item) => (
          <button
            key={item.action}
            type="button"
            onClick={() => triggerAction(item.action)}
            disabled={pending}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-black text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {item.label}
          </button>
        ))}
      </div>

      {message ? (
        <p className="mt-3 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700">{message}</p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {quickNavActions.map((action) => (
          <Link key={action.label} href={action.href} className={action.className}>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
