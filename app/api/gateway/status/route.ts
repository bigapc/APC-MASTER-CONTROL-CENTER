import { NextResponse } from "next/server";
import { getGatewayUser } from "@/lib/events/gatewayApi";
import { canPerformGatewayOperation } from "@/lib/events/gatewayAuthorization";
import { getGatewayStatus } from "@/lib/events/gatewayService";
import { withCors } from "@/lib/security/apiHelpers";

export async function GET(request: Request) {
  const user = await getGatewayUser();
  if (!canPerformGatewayOperation(user, "view")) {
    const status = user ? 403 : 401;
    return withCors(NextResponse.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status }), request.headers.get("origin"));
  }
  return withCors(NextResponse.json(getGatewayStatus()), request.headers.get("origin"));
}
