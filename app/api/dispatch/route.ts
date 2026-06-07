import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSessionValue, SESSION_COOKIE } from "@/lib/auth";
import {
  getDispatchQueue,
  assignDispatchCase,
  escalateDispatchCase,
  closeDispatchCase,
  getDispatcherHealth,
} from "@/lib/integrations/platformConnector";
import { emitAuditEvent } from "@/lib/events/liveEventEmitter";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

// GET /api/dispatch — returns current queue + dispatcher health
export async function GET(request: Request) {
  const [queue, health] = await Promise.all([
    getDispatchQueue(),
    getDispatcherHealth(),
  ]);

  return withCors(NextResponse.json({ queue, health }), request.headers.get("origin"));
}

// POST /api/dispatch — perform a dispatch action (assign | escalate | close)
export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (!user) {
    return withCors(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), requestOrigin);
  }

  const body = await request.json() as {
    action: "assign" | "escalate" | "close";
    caseId: string;
    dispatcherId?: string;
    reason?: string;
  };

  const { action, caseId } = body;

  if (!action || !caseId) {
    return withCors(NextResponse.json({ error: "Missing action or caseId" }, { status: 400 }), requestOrigin);
  }

  let success = false;

  if (action === "assign") {
    if (!body.dispatcherId) {
      return withCors(NextResponse.json({ error: "Missing dispatcherId" }, { status: 400 }), requestOrigin);
    }
    success = await assignDispatchCase(caseId, body.dispatcherId, user.id);
  } else if (action === "escalate") {
    if (!body.reason) {
      return withCors(NextResponse.json({ error: "Missing reason" }, { status: 400 }), requestOrigin);
    }
    success = await escalateDispatchCase(caseId, body.reason, user.id);
  } else if (action === "close") {
    success = await closeDispatchCase(caseId, user.id);
  } else {
    return withCors(NextResponse.json({ error: "Unknown action" }, { status: 400 }), requestOrigin);
  }

  emitAuditEvent(`dispatch:${action}`, user.name, "dispatch-api", { caseId, success });

  return withCors(NextResponse.json({ success }), requestOrigin);
}
