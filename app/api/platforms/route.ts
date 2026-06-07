import { NextResponse } from "next/server";
import { safeConnectConfig } from "@/lib/integrations/safeconnect";
import { communitySafeConnectConfig } from "@/lib/integrations/communitySafeConnect";
import { csc20Config } from "@/lib/integrations/csc20";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  return withCors(NextResponse.json({
    success: true,

    platforms: [
      {
        id: safeConnectConfig.id,
        name: safeConnectConfig.name,
      },

      {
        id: communitySafeConnectConfig.id,
        name: communitySafeConnectConfig.name,
      },

      {
        id: csc20Config.id,
        name: csc20Config.name,
      },
    ],
  }), request.headers.get("origin"));
}
