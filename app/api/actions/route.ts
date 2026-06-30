import { NextResponse } from "next/server";
import { withCors } from "@/lib/security/apiHelpers";
import { emitAuditEvent, emitNotification } from "@/lib/events/liveEventEmitter";
import { getPlatformHealth } from "@/lib/integrations/platformConnector";

type DashboardAction =
  | "review_reports"
  | "sync_dispatch"
  | "probe_platforms"
  | "broadcast_notice";

type ActionPayload = {
  action?: DashboardAction;
};

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const body = (await request.json().catch(() => null)) as ActionPayload | null;
  const action = body?.action;

  if (!action) {
    return withCors(
      NextResponse.json({ success: false, message: "Action is required." }, { status: 400 }),
      origin
    );
  }

  if (action === "review_reports") {
    emitAuditEvent("reports:review-requested", "operator", "apc_control_center", {
      intent: "reports",
    });
    emitNotification(
      "Reports review started",
      "Operator triggered report review from quick actions.",
      "info",
      "apc_control_center"
    );

    return withCors(NextResponse.json({ success: true, message: "Reports review event emitted." }), origin);
  }

  if (action === "sync_dispatch") {
    emitAuditEvent("dispatch:sync-requested", "operator", "dispatch", {
      intent: "dispatch",
    });
    emitNotification(
      "Dispatch sync requested",
      "Dispatcher queue sync was requested from quick actions.",
      "warning",
      "dispatch"
    );

    return withCors(NextResponse.json({ success: true, message: "Dispatch sync event emitted." }), origin);
  }

  if (action === "probe_platforms") {
    const health = await getPlatformHealth();
    const degraded = health.filter((item) => item.status !== "healthy").length;

    emitAuditEvent("platforms:probe-requested", "operator", "apc_control_center", {
      total: health.length,
      degraded,
    });

    emitNotification(
      "Platform probe completed",
      degraded > 0
        ? `${degraded} platform(s) require monitoring.`
        : "All connected platforms reported healthy.",
      degraded > 0 ? "warning" : "info",
      "apc_control_center"
    );

    return withCors(
      NextResponse.json({
        success: true,
        message: degraded > 0 ? "Probe completed with warnings." : "Probe completed successfully.",
      }),
      origin
    );
  }

  if (action === "broadcast_notice") {
    emitAuditEvent("operations:broadcast-notice", "operator", "apc_control_center", {
      intent: "notice",
    });
    emitNotification(
      "Operations notice",
      "APC operations broadcast issued from quick actions.",
      "critical",
      "apc_control_center"
    );

    return withCors(NextResponse.json({ success: true, message: "Operations notice broadcasted." }), origin);
  }

  return withCors(
    NextResponse.json({ success: false, message: "Unsupported action." }, { status: 400 }),
    origin
  );
}
