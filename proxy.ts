import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

const PUBLIC_PATHS = ["/", "/login"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/api/auth")) {
    return true;
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  if (isPreviewBypassEnabled()) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (isPublicPath(pathname)) {
    if (pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
