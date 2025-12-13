import apiClient from "@/lib/apiClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
  }

  try {
    // Call the actual backend endpoint (with /api prefix)
    const response = await apiClient.get(
      `/api/auth/google/callback?code=${code}`,
    );
    const data = response.data;

    if (!data.token) {
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", req.url),
      );
    }

    // Redirect to home page with token in cookie
    const redirectUrl = new URL("/", req.url);
    const response2 = NextResponse.redirect(redirectUrl);
    response2.cookies.set("token", data.token, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: false, // Needs to be accessible to client-side code
      sameSite: "lax",
    });

    return response2;
  } catch (error: unknown) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_error", req.url));
  }
}
