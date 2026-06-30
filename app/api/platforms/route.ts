import { NextResponse } from "next/server";
import { safeConnectConfig } from "@/lib/integrations/safeconnect";
import { communitySafeConnectConfig } from "@/lib/integrations/communitySafeConnect";
import { csc20Config } from "@/lib/integrations/csc20";
import { withCors } from "@/lib/security/apiHelpers";
import { getRuntimeStatus } from "@/lib/runtimeStatus";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const runtime = await getRuntimeStatus();

  return withCors(NextResponse.json({
    success: true,
    liveReady: runtime.liveReady,
    mode: runtime.mode,

    platforms: [
      {
        id: safeConnectConfig.id,
        name: safeConnectConfig.name,
        configured: runtime.platforms.find((platform) => platform.id === safeConnectConfig.id)?.ready ?? false,
        reachable: runtime.platforms.find((platform) => platform.id === safeConnectConfig.id)?.publicReachable ?? false,
      },

      {
        id: communitySafeConnectConfig.id,
        name: communitySafeConnectConfig.name,
        configured: runtime.platforms.find((platform) => platform.id === communitySafeConnectConfig.id)?.ready ?? false,
        reachable: runtime.platforms.find((platform) => platform.id === communitySafeConnectConfig.id)?.publicReachable ?? false,
      },

      {
        id: csc20Config.id,
        name: csc20Config.name,
        configured: runtime.platforms.find((platform) => platform.id === csc20Config.id)?.ready ?? false,
        reachable: runtime.platforms.find((platform) => platform.id === csc20Config.id)?.publicReachable ?? false,
      },
    ],
  }), request.headers.get("origin"));
}
