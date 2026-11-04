import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

const PUBLIC_PATHS = ["/", "/login"];

function getContentSecurityPolicy(nonce: string) {
  const scriptSource = process.env.NODE_ENV === "development"
    ? `'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}'`;

  return [
    "default-src 'self'",
    `script-src ${scriptSource}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.github.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function continueWithCsp(request: NextRequest, nonce: string, csp: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  if (pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
    return true;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    (!pathname.startsWith("/api/") && /\.[^/]+$/.test(pathname))
  ) {
    return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = getContentSecurityPolicy(nonce);

  if (isPreviewBypassEnabled()) {
    return continueWithCsp(request, nonce, csp);
  }

  const { pathname, search } = request.nextUrl;
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (isPublicPath(pathname)) {
    if (pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return continueWithCsp(request, nonce, csp);
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  return continueWithCsp(request, nonce, csp);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
