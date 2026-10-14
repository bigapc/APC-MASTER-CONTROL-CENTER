import { NextResponse } from "next/server";
import { getIncidentUser } from "@/lib/incidents/api";
import { getIncident, updateIncident } from "@/lib/incidents/service";
import { withCors } from "@/lib/security/apiHelpers";

type Context = { params: Promise<{ incidentId: string }> };

export async function GET(request: Request, { params }: Context) {
  const { incidentId } = await params;
  const result = await getIncident(await getIncidentUser(), incidentId);
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : 403;
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", incident: result.data } : { error: result.error }, { status }), request.headers.get("origin"));
}

export async function PATCH(request: Request, { params }: Context) {
  await params;
  const result = await updateIncident(await getIncidentUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
