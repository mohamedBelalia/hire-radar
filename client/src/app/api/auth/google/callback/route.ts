import apiClient from "@/lib/apiClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      const errorUrl = new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      );
      errorUrl.pathname = "/login";
      errorUrl.searchParams.set("error", "missing_code");
      return NextResponse.redirect(errorUrl.toString());
    }

    const response = await apiClient.get(`/auth/google/callback?code=${code}`);
    const data = response.data;

    if (!data || !data.token) {
      const errorUrl = new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      );
      errorUrl.pathname = "/login";
      errorUrl.searchParams.set("error", "auth_failed");
      return NextResponse.redirect(errorUrl.toString());
    }

    // Redirect to home page
    const redirectUrl = new URL(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    );
    redirectUrl.pathname = "/";

    const response2 = NextResponse.redirect(redirectUrl.toString());

    // Set token in cookie
    response2.cookies.set("token", data.token, {
      path: "/",
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response2;
  } catch (error: unknown) {
    console.error("OAuth callback error:", error);

    // Redirect to login with error
    const errorUrl = new URL(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    );
    errorUrl.pathname = "/login";
    const errorMessage =
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "error" in error.response.data &&
      typeof error.response.data.error === "string"
        ? error.response.data.error
        : "oauth_error";
    errorUrl.searchParams.set("error", errorMessage);

    return NextResponse.redirect(errorUrl.toString());
  }
}
