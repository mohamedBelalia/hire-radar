"use client";

import ProfileHeader from "./profile/components/profile-header";
import ProfileSidebar from "@/app/(home)/profile/components/profile-sidebar";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ["profile", "security", "notifications"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("tab-change", handleTabChange as EventListener);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener(
        "tab-change",
        handleTabChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Global Header */}
      <div className="mb-8">
        <ProfileHeader user={currentUser} />
      </div>

      {/* Global Layout with Sidebar */}
      <div className="md:flex gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <ProfileSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
