import { NextResponse } from "next/server";
import { getIncidentUser } from "@/lib/incidents/api";
import { acknowledgeIncident, assignIncident, closeIncident, escalateIncident, resolveIncident } from "@/lib/incidents/service";
import { withCors } from "@/lib/security/apiHelpers";

type Context = { params: Promise<{ action: string }> };
const actions = { acknowledge: acknowledgeIncident, assign: assignIncident, escalate: escalateIncident, resolve: resolveIncident, close: closeIncident } as const;

export async function POST(request: Request, { params }: Context) {
  const { action } = await params;
  const operation = actions[action as keyof typeof actions];
  if (!operation) return withCors(NextResponse.json({ error: "Unknown action" }, { status: 400 }), request.headers.get("origin"));

  const result = await operation(await getIncidentUser());
  const status = result.ok ? 200 : result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 503;
  return withCors(NextResponse.json(result.ok ? { status: "not_configured" } : { error: result.error }, { status }), request.headers.get("origin"));
}
