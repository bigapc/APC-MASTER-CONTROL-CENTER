import { NextResponse } from "next/server";
import { getCSCOrganizations } from "@/lib/integrations/connectors/communitySafeConnect";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const organizations = await getCSCOrganizations();
  return withCors(NextResponse.json({ organizations }), request.headers.get("origin"));
}
