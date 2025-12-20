"use client";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {

  return (
    <div className="grid min-h-svh lg:grid-cols-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img
              src={"/radar.svg"}
              alt="hire-radar"
              width={25}
              height={25}
              className="invert dark:invert-0 border-0 bg-transparent outline-none"
              style={{ display: "block" }}
            />
            Hire-radar
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
