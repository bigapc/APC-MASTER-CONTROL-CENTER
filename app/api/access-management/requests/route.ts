import { NextResponse } from "next/server";
import { getAccessUser } from "@/lib/access/api";
import { createAccessRequest, listAccessRequests } from "@/lib/access/service";
import { withCors } from "@/lib/security/apiHelpers";

export async function GET(request: Request) {
  const result = await listAccessRequests(await getAccessUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : 403;
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", requests: result.data } : { error: result.error }, { status }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const result = await createAccessRequest(await getAccessUser());
  const status = result.ok ? 202 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
