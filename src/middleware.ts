import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define admin routes and their required roles
const ADMIN_ROUTES = {
  "/admin/users": "super_admin",
  "/admin/dashboard": "admin",
  "/admin/gallery": "admin",
  "/admin/events": "admin",
  "/admin/banners": "admin",
  "/admin/announcements": "admin",
  "/admin/donations": "admin",
  "/admin/contacts": "admin",
  "/admin/cleanup": "admin",
  "/admin/gallery/add": "admin",
  "/admin/events/add": "admin",
  "/admin/qr-codes": "admin",
  "/admin/qr-codes/[id]": "admin",
} as const;

// Routes that don't need protection
const PUBLIC_ADMIN_ROUTES = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes, API routes, and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/") ||
    PUBLIC_ADMIN_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if this is an admin route that needs protection
  const adminRoute = Object.keys(ADMIN_ROUTES).find(route =>
    pathname.startsWith(route)
  );

  if (adminRoute) {
    const requiredRole = ADMIN_ROUTES[adminRoute as keyof typeof ADMIN_ROUTES];

    // Get admin session from cookies
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      // Parse the session data
      const sessionData = JSON.parse(decodeURIComponent(adminSession.value));

      // Check if user has required role
      if (
        sessionData.role !== requiredRole &&
        sessionData.role !== "super_admin"
      ) {
        // Redirect to dashboard if insufficient privileges
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // Allow access
      return NextResponse.next();
    } catch {
      // Invalid session, redirect to login
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Allow access to non-admin routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
