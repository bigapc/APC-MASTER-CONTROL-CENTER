import { NextResponse } from "next/server";
import { getGatewayUser } from "@/lib/events/gatewayApi";
import { listGatewayEvents, receiveGatewayEvent } from "@/lib/events/gatewayService";
import { withCors } from "@/lib/security/apiHelpers";

function statusFor(error: string) {
  return error === "Unauthorized" ? 401 : error === "Forbidden" ? 403 : error === "NotConfigured" ? 503 : 400;
}

export async function GET(request: Request) {
  const result = await listGatewayEvents(await getGatewayUser());
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", events: result.data } : { error: result.error }, { status: result.ok ? 200 : statusFor(result.error) }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null);
  const result = await receiveGatewayEvent(await getGatewayUser(), input);
  return withCors(NextResponse.json(result.ok ? { status: "pending_review" } : { error: result.error }, { status: result.ok ? 202 : statusFor(result.error) }), request.headers.get("origin"));
}
