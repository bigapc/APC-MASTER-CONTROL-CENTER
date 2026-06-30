import { NextResponse } from "next/server";
import { withCors } from "@/lib/security/apiHelpers";
import { acknowledgeOperation } from "@/lib/services/operationsAcks";
import { emitAuditEvent, emitNotification } from "@/lib/events/liveEventEmitter";

type AcknowledgePayload = {
  operationId?: string;
  actor?: string;
};

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const body = (await request.json().catch(() => null)) as AcknowledgePayload | null;
  const operationId = body?.operationId?.trim();
  const actor = body?.actor?.trim() || "operator";

  if (!operationId) {
    return withCors(
      NextResponse.json({ success: false, message: "operationId is required." }, { status: 400 }),
      origin
    );
  }

  acknowledgeOperation(operationId);

  emitAuditEvent("operations:acknowledged", actor, "apc_control_center", {
    operationId,
  });

  emitNotification(
    "Operation acknowledged",
    `Timeline item ${operationId} was acknowledged by ${actor}.`,
    "info",
    "apc_control_center"
  );

  return withCors(
    NextResponse.json({ success: true, message: "Operation acknowledged.", operationId }),
    origin
  );
}
