import { NextResponse } from "next/server";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  return withCors(NextResponse.json({
    apps: [
      {
        id: "safeconnect",
        name: "SafeConnect",
      },
      {
        id: "communitysafeconnect",
        name: "CommunitySafeConnect",
      },
      {
        id: "csc_2_0",
        name: "CSC 2.0",
      },
    ],
  }), request.headers.get("origin"));
}
