// frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isAdminRoute = url.pathname.startsWith("/admin-panel");

  const adminToken = request.cookies.get("admin_access")?.value;

  if (isAdminRoute && !adminToken) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// This tells Next.js to run middleware on these paths
export const config = {
  matcher: ["/admin-panel/:path*"],
};
