import { NextResponse } from "next/server";
import { getAlertsFeed } from "@/lib/dashboard/liveFeeds";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const alerts = await getAlertsFeed(25);

  return withCors(
    NextResponse.json({ alerts, count: alerts.length }),
    request.headers.get("origin")
  );
}
