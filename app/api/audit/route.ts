import { NextResponse } from "next/server";
import { getLiveAuditLog } from "@/lib/events/liveEventEmitter";
import { getAuditLogs } from "@/lib/supabase/audit";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 200);

  // Live in-memory log (from event bus mutations this session)
  const inMemory = getLiveAuditLog();

  // Persisted log from Supabase (empty when in demo mode)
  const persisted = await getAuditLogs(limit);

  // Merge: in-memory first (most recent activity), then persisted history
  const seen = new Set(inMemory.map((r) => r.id));
  const merged = [
    ...inMemory,
    ...persisted.filter((r) => !seen.has(r.id)),
  ].slice(0, limit);

  const logs =
    merged.length > 0
      ? merged
      : [
          { id: "demo-1", action: "Platform Started", actor: "system", timestamp: new Date().toISOString() },
          { id: "demo-2", action: "Demo mode active", actor: "system", timestamp: new Date().toISOString() },
        ];

  return withCors(NextResponse.json({ logs, count: logs.length }), request.headers.get("origin"));
}
