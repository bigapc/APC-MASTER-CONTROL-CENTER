import { NextResponse } from "next/server";
import { getAccessUser } from "@/lib/access/api";
import { listAccessAudit } from "@/lib/access/service";
import { withCors } from "@/lib/security/apiHelpers";

export async function GET(request: Request) {
  const result = await listAccessAudit(await getAccessUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : 403;
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", audit: result.data } : { error: result.error }, { status }), request.headers.get("origin"));
}
