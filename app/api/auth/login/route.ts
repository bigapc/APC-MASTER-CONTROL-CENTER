import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionValue,
  validateCredentials,
} from "@/lib/auth";
import { supabaseSignIn } from "@/lib/supabase/auth";
import { checkRateLimit, retryAfterSeconds } from "@/lib/security/rateLimit";
import { getClientIp, methodNotAllowed, withCors } from "@/lib/security/apiHelpers";

// Reject any method other than POST immediately
export async function GET() {
  return methodNotAllowed(["POST", "OPTIONS"]);
}

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");

  // Rate limit: 10 login attempts per IP per minute
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`login:${ip}`, 10, 60_000))) {
    const retryAfter = await retryAfterSeconds(`login:${ip}`, 60_000);
    return withCors(
      NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      ),
      requestOrigin
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  const liveUser = await supabaseSignIn(email, password);
  const user = liveUser ?? validateCredentials(email, password);

  if (!user) {
    return withCors(
      NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      ),
      requestOrigin
    );
  }

  const response = NextResponse.json({ success: true, user });
  let sessionValue: string;

  try {
    sessionValue = await createSessionValue(user);
  } catch {
    return withCors(
      NextResponse.json(
        { success: false, message: "Authentication service is not configured." },
        { status: 503 }
      ),
      requestOrigin
    );
  }

  response.cookies.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return withCors(response, requestOrigin);
}
