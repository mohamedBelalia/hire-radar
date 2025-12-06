import { me } from "@/features/auth/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  const res = await me(token)
  
  if(!res){
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/", 
  ],
};