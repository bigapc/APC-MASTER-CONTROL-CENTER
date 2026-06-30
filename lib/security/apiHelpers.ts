// lib/security/apiHelpers.ts
// Shared utilities for API route handlers:
//   - Method guard (405 for disallowed methods)
//   - CORS headers restricted to same origin in production
//   - IP extraction helper

import { NextResponse } from "next/server";

/** Return a 405 Method Not Allowed response. */
export function methodNotAllowed(allowed: string[]) {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: allowed.join(", ") },
  });
}

/** Extract best-effort client IP from a Request. */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Add CORS headers to a NextResponse.
 * In production, origin must match NEXT_PUBLIC_APP_ORIGIN (set on Vercel).
 * In development, any origin is allowed for convenience.
 */
export function withCors(response: NextResponse, requestOrigin?: string | null): NextResponse {
  const isProd = process.env.NODE_ENV === "production";
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "*";

  const origin =
    isProd
      ? (requestOrigin === allowedOrigin ? allowedOrigin : "null")
      : (requestOrigin ?? "*");

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-APC-Timestamp, X-APC-Signature, X-APC-Webhook-Secret"
  );
  response.headers.set("Vary", "Origin");
  return response;
}
