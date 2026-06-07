"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  level: "info" | "warning" | "critical";
}

const LEVEL_STYLE: Record<Notification["level"], string> = {
  info: "border-l-blue-500 bg-blue-950/30",
  warning: "border-l-yellow-400 bg-yellow-950/30",
  critical: "border-l-red-500 bg-red-950/30",
};

const LEVEL_DOT: Record<Notification["level"], string> = {
  info: "bg-blue-400",
  warning: "bg-yellow-400",
  critical: "bg-red-500",
};

const POLL_INTERVAL_MS = 10_000;

export default function LiveNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json() as { notifications: Notification[]; count: number };
      setNotifications(json.notifications ?? []);
      const newCount = json.count - lastCountRef.current;
      if (newCount > 0 && !open) {
        setUnread((prev) => prev + newCount);
      }
      lastCountRef.current = json.count;
    } catch {
      // silent — network errors shouldn't break the shell
    }
  }

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleOpen() {
    setOpen((v) => !v);
    setUnread(0);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
            <span className="text-sm font-bold text-white">Live Notifications</span>
            <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
              {notifications.length}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-zinc-500">
                No notifications
              </p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`border-l-2 px-4 py-3 ${LEVEL_STYLE[n.level]}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${LEVEL_DOT[n.level]}`} />
                      <p className="text-sm font-semibold text-white">{n.title}</p>
                    </div>
                    {n.message && (
                      <p className="mt-1 pl-4 text-xs text-zinc-400">{n.message}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-zinc-700 px-4 py-2">
            <p className="text-[10px] text-zinc-500">
              Polling every {POLL_INTERVAL_MS / 1000}s · {notifications.length} total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
