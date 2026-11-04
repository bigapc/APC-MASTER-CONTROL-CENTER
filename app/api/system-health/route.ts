import { NextResponse } from "next/server";
import { getPlatformHealth } from "@/lib/integrations/platformConnector";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const health = await getPlatformHealth();
  const healthyPlatforms = health.filter((item) => item.status === "healthy").length;
  const hasWarnings = health.some((item) => item.status === "warning");

  return withCors(NextResponse.json({
    uptime: "n/a",
    status: healthyPlatforms === health.length ? "healthy" : hasWarnings ? "warning" : "monitoring",
    platforms: health,
  }), request.headers.get("origin"));
}
