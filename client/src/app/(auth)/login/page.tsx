"use client";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        missing_code: "Google OAuth authorization code is missing",
        auth_failed: "Google authentication failed. Please try again.",
        oauth_error: "An error occurred during Google OAuth. Please try again.",
      };
      toast.error(errorMessages[error] || "Authentication failed");
    }
  }, [searchParams]);

  return (
    <div className="grid min-h-svh lg:grid-cols-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className=" size-6 items-center justify-center rounded-md">
              <Image
                src={"/radar.svg"}
                alt="hire-radar"
                width={25}
                height={25}
              />
            </div>
            Hire-radar
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}