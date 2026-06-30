import { NextResponse } from "next/server";
import { getCapabilityCounts, MASTER_PLATFORM_CAPABILITIES } from "@/lib/config/masterPlatformCapabilities";
import { methodNotAllowed, withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  return withCors(
    NextResponse.json({
      success: true,
      summary: getCapabilityCounts(),
      capabilities: MASTER_PLATFORM_CAPABILITIES,
    }),
    request.headers.get("origin")
  );
}

export async function POST() {
  return methodNotAllowed(["GET", "OPTIONS"]);
}