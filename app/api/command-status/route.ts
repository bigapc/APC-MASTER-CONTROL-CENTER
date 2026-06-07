import { NextResponse } from "next/server";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  return withCors(NextResponse.json({
    commandCenter: "online",

    connectedApps: 3,

    uptime: "99.9%",

    dispatchers: 8,
  }), request.headers.get("origin"));
}
