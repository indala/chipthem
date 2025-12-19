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
      apiPrefix: "/api/admin",
      cookieName: "admin_token",
      loginPath: "/alogin",
      dashboardPath: "/admin/dashboard",
    },
    {
      role: "veterinary",
      prefix: "/veterinary",
      apiPrefix: "/api/veterinary",
      cookieName: "veterinary_token",
      loginPath: "/vlogin",
      dashboardPath: "/veterinary/dashboard",
    },
    {
      role: "petOwner",
      prefix: "/petOwner",
      apiPrefix: "/api/owner",
      cookieName: "petOwner_token",
      loginPath: "/pologin",
      dashboardPath: "/petOwner/dashboard",
    },
  ] as const;

  const { pathname } = req.nextUrl;

  // Allow static files, favicon, and public API routes
  if (
    pathname === "/unauthorized" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/api/pet/login" ||
    pathname === "/api/pet/register" ||
    pathname === "/api/veterinary/login" ||
    pathname === "/api/veterinary/register" ||
    pathname === "/api/admin/login"
  ) {
    return NextResponse.next();
  }

  // Find role config by page prefix, api prefix, or login path
  const config = rolesConfig.find(
    (c) =>
      pathname.startsWith(c.prefix) ||
      pathname.startsWith(c.apiPrefix) ||
      pathname === c.loginPath
  );

  if (!config) return NextResponse.next();

  const { cookieName, loginPath, dashboardPath, role, prefix, apiPrefix } =
    config;
  const token = req.cookies.get(cookieName)?.value;

  // If hitting login page but already logged in with correct role → redirect to dashboard
  if (pathname === loginPath && token) {
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

  // Protect pages & APIs under this role’s prefixes
  if (
    pathname.startsWith(prefix) ||
    pathname.startsWith(apiPrefix)
  ) {
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      if (payload.role !== role) {
        const res = NextResponse.redirect(new URL("/unauthorized", req.url));
        res.cookies.delete(cookieName);
        return res;
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

// ✅ Matcher stays the same
export const config = {
  matcher: [
    "/admin/:path*",
    "/veterinary/:path*",
    "/petOwner/:path*",
    "/api/admin/:path*",
    "/api/veterinary/:path*",
    "/api/owner/:path*",
    "/alogin",
    "/vlogin",
    "/pologin",
    "/unauthorized",
  ],
};
