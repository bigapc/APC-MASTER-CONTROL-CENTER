import { NextResponse } from "next/server";
import { userDirectory } from "@/lib/services/userDirectory";
import { withCors } from "@/lib/security/apiHelpers";

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function GET(request: Request) {
  return withCors(NextResponse.json(userDirectory), request.headers.get("origin"));
}
