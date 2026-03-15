import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // allow public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // if no token redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // token exists → allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/developer/:path*", "/founder/:path*"],
};