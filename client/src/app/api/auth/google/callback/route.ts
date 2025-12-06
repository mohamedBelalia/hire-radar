import apiClient from "@/lib/apiClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const response = await apiClient.get(`/auth/google/callback?code=${code}`);
  const data = response.data;
  
  const response2 = NextResponse.redirect(process.env.NEXT_APP_URL!);
  response2.cookies.set("token", data.token, { path: "/" });

  return response2;
}