import { NextResponse } from "next/server";
import { getIncidentUser } from "@/lib/incidents/api";
import { createIncident, listIncidents } from "@/lib/incidents/service";
import { withCors } from "@/lib/security/apiHelpers";

export async function GET(request: Request) {
  const result = await listIncidents(await getIncidentUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : 403;
  return withCors(NextResponse.json(result.ok ? { status: "not_connected", incidents: result.data } : { error: result.error }, { status }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const result = await createIncident(await getIncidentUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
