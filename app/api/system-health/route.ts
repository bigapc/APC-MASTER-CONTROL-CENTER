import { NextResponse } from "next/server";
import { getPlatformHealth } from "@/lib/integrations/platformConnector";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const health = await getPlatformHealth();
  const healthyPlatforms = health.filter((item) => item.status === "healthy").length;

  return withCors(NextResponse.json({
    uptime: "99.9%",
    status: healthyPlatforms === health.length ? "healthy" : "monitoring",
    platforms: health,
  }), request.headers.get("origin"));
}
