import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/saved", "/dashboard"];

/**
 * Guards protected routes by redirecting unauthenticated requests to the login page while preserving the original destination.
 *
 * @param req - The incoming Next.js request to check for an authentication token and pathname.
 * @returns A NextResponse that redirects to `/login` with a `redirect` query parameter when access is blocked, or a response that allows the request to proceed otherwise.
 */
export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

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