import { NextRequest, NextResponse } from "next/server";
import jwt  from "jsonwebtoken";


interface JwtPayload {
  id: number;
  role: "developer" | "founder";
}

export function middleware(req: NextRequest){
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  if(
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ){
    return NextResponse.next();
  }

  if(!token){
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if(pathname.startsWith("/developer") && decoded.role !== "developer"){
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if(pathname.startsWith("/founder") && decoded.role !== "founder"){
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err){
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url))
  }
  
}

export const config = {
  matcher: ["/developer/:path*", "/founder/:path*"],
};