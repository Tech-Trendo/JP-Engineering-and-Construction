import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Target all admin routes
  if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has("admin_refresh_token");
    const isLoginPage = pathname === "/admin/login";

    // Authenticated users visiting login page get redirected to dashboard
    if (isLoginPage && hasSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Unauthenticated users visiting any admin route other than login get redirected to login
    if (!isLoginPage && !hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
