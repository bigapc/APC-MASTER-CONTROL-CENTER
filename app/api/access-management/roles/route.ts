import { NextResponse } from "next/server";
import { getAccessUser } from "@/lib/access/api";
import { assignRole, removeRole } from "@/lib/access/service";
import { withCors } from "@/lib/security/apiHelpers";

export async function POST(request: Request) {
  const result = await assignRole(await getAccessUser());
  const status = result.ok ? 202 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}

export async function DELETE(request: Request) {
  const result = await removeRole(await getAccessUser());
  const status = result.ok ? 202 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
