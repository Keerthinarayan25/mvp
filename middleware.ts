import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");


  if (isAuthPage) {
    return NextResponse.next();
  }


  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  try {
    const user = verifyToken(token);

    if (
      user.role === "developer" &&
      req.nextUrl.pathname.startsWith("/founder")
    ) {
      return NextResponse.redirect(new URL("/developer/dashboard", req.url));
    }

    if (
      user.role === "founder" &&
      req.nextUrl.pathname.startsWith("/developer")
    ) {
      return NextResponse.redirect(new URL("/founder/dashboard", req.url));
    }

    return NextResponse.next();

  } catch {
    return NextResponse.next();
  }

}

export const config = {
  matcher: ["/developer/:path*", "/founder/:path*"],
};