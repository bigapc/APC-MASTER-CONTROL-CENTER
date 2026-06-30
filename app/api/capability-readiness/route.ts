import { NextResponse } from "next/server";
import { getCapabilityReadiness } from "@/lib/launch/capabilityReadiness";
import { methodNotAllowed, withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const readiness = await getCapabilityReadiness();

  return withCors(
    NextResponse.json({
      success: true,
      ...readiness,
    }),
    request.headers.get("origin")
  );
}

export async function POST() {
  return methodNotAllowed(["GET", "OPTIONS"]);
}