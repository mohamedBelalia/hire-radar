'use client'

import { useState, useEffect } from "react";
import Dashboard from "@/app/(home)/components/Dashboard";
import LandingPage from "@/components/landing/LandingPage";
import { getToken } from "@/lib";
import { useApplyJob, useReportJob } from "@/features/jobs/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token on client side
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Optional: Loading state while checking auth
    return null;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LandingPage />;
}
