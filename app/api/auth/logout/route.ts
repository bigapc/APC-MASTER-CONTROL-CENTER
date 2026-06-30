import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { supabaseSignOut } from "@/lib/supabase/auth";
import { methodNotAllowed, withCors } from "@/lib/security/apiHelpers";

export async function GET() {
  return methodNotAllowed(["POST", "OPTIONS"]);
}

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  await supabaseSignOut();

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return withCors(response, request.headers.get("origin"));
}
