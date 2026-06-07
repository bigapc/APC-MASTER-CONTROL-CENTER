import { NextResponse } from "next/server";
import { getLiveNotifications } from "@/lib/events/liveEventEmitter";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const live = getLiveNotifications();

  const notifications =
    live.length > 0
      ? live
      : [
          { id: "demo-1", title: "System Online", message: "APC Master Control Center is operational.", level: "info" },
          { id: "demo-2", title: "All Platforms Connected", message: "SafeConnect, CSC, and CSC 2.0 reporting healthy.", level: "info" },
        ];

  return withCors(
    NextResponse.json({ notifications, count: notifications.length }),
    request.headers.get("origin")
  );
}
