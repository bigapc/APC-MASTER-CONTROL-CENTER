"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  source?: string;
  timestamp: string;
}

const POLL_INTERVAL_MS = 15_000;

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LiveAuditFeed({ limit = 20 }: { limit?: number }) {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    try {
      const res = await fetch(`/api/audit?limit=${limit}`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json() as { logs: AuditRecord[] };
      setLogs(json.logs ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void fetchLogs();
    });
    const timer = setInterval(fetchLogs, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-4">
        <Shield className="h-4 w-4 text-zinc-400" />
        <h3 className="text-sm font-bold text-white">Live Audit Feed</h3>
        <span className="ml-auto rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
          LIVE · {POLL_INTERVAL_MS / 1000}s
        </span>
      </div>

      {loading ? (
        <div className="px-5 py-8 text-center text-sm text-zinc-500">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-zinc-500">No audit events yet</div>
      ) : (
        <ul className="divide-y divide-zinc-800/50">
          {logs.slice(0, limit).map((log) => (
            <li key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-zinc-900/40 transition-colors">
              <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-200">{log.action}</p>
                <p className="text-xs text-zinc-500">
                  <span className="text-zinc-400">{log.actor}</span>
                  {log.source && <> · {log.source}</>}
                  {" · "}{fmt(log.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-zinc-800 px-5 py-2">
        <p className="text-[10px] text-zinc-600">
          In-memory + Supabase · showing {Math.min(logs.length, limit)} events
        </p>
      </div>
    </div>
  );
}
