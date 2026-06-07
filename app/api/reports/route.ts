import { NextResponse } from "next/server";
import { getAllReports } from "@/lib/integrations/platformConnector";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  const reports = await getAllReports();

  return withCors(NextResponse.json({
    reports,
  }), request.headers.get("origin"));
}
