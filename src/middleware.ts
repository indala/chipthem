import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("⚠️ JWT_SECRET is not set in environment variables");
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const secret = new TextEncoder().encode(jwtSecret);

  const rolesConfig = [
    {
      role: "admin",
      prefix: "/admin",
      cookieName: "admin_token",
      loginPath: "/alogin",
      dashboardPath: "/admin/verifications/petOwner",
    },
    {
      role: "veterinary",
      prefix: "/veterinary",
      cookieName: "veterinary_token",
      loginPath: "/vlogin",
      dashboardPath: "/veterinary/dashboard",
    },
    {
      role: "petOwner",
      prefix: "/petOwner",
      cookieName: "petOwner_token",
      loginPath: "/pologin",
      dashboardPath: "/petOwner/dashboard",
    },
  ];

  const { pathname } = req.nextUrl;

  // Allow static files, API, favicon
  if (
    pathname === "/unauthorized" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const config = rolesConfig.find(
    (c) => pathname.startsWith(c.prefix) || pathname === c.loginPath
  );

  if (!config) return NextResponse.next();

  const { cookieName, loginPath, dashboardPath, role } = config;
  const token = req.cookies.get(cookieName)?.value;

  // Login redirect if already logged in
  if (pathname === loginPath) {
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, secret);
        if (payload.role === role) {
          return NextResponse.redirect(new URL(dashboardPath, req.url));
        }
      } catch {
        const res = NextResponse.next();
        res.cookies.delete(cookieName);
        return res;
      }
    }
    return NextResponse.next();
  }

  // Protected route check
  if (pathname.startsWith(config.prefix)) {
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      if (payload.role !== role) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL(loginPath, req.url));
      res.cookies.delete(cookieName);
      return res;
    }
  }

  return NextResponse.next();
}

// ✅ DO NOT EXPORT DEFAULT in Next 15
export const config = {
  matcher: [
    "/admin/:path*",
    "/veterinary/:path*",
    "/petOwner/:path*",
    "/alogin",
    "/vlogin",
    "/pologin",
    "/unauthorized",
  ],
};
