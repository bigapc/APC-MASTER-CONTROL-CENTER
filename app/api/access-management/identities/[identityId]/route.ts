import { NextResponse } from "next/server";
import { getAccessUser } from "@/lib/access/api";
import { listIdentities } from "@/lib/access/service";
import { withCors } from "@/lib/security/apiHelpers";

type Context = { params: Promise<{ identityId: string }> };

export async function GET(request: Request, { params }: Context) {
  const { identityId } = await params;
  const result = await listIdentities(await getAccessUser());
  const identity = result.ok ? result.data.find((item) => item.userId === identityId) ?? null : null;
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : 403;
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", identity } : { error: result.error }, { status }), request.headers.get("origin"));
}
