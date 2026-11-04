import { NextResponse } from "next/server";
import { getAccessUser } from "@/lib/access/api";
import { deactivateIdentity } from "@/lib/access/service";
import { withCors } from "@/lib/security/apiHelpers";

type Context = { params: Promise<{ identityId: string }> };

export async function POST(request: Request, { params }: Context) {
  await params;
  const result = await deactivateIdentity(await getAccessUser());
  const status = result.ok ? 202 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
