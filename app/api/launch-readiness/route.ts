import { NextResponse } from "next/server";
import { withCors } from "@/lib/security/apiHelpers";
import { getLaunchReadiness } from "@/lib/launch/readiness";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const readiness = await getLaunchReadiness();

  return withCors(
    NextResponse.json({
      launchReady: readiness.launchReady,
      passedCount: readiness.passedCount,
      failedCount: readiness.failedCount,
      previewBypass: readiness.previewBypass,
      gates: readiness.gates,
    }),
    request.headers.get("origin")
  );
}
