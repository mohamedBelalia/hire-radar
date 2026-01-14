"use client";

import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import ProfileSidebar from "@/app/profile/components/profile-sidebar";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";

/**
 * Candidate profile page that renders the profile layout and synchronizes the active tab with the URL hash and custom tab-change events.
 *
 * The component reads the current user, maintains the active tab state (one of "profile", "security", or "notifications"), updates that state from the location hash and from dispatched "tab-change" events, and provides the active tab as the default to ProfileContent.
 *
 * @returns The React element for the candidate profile dashboard.
 */
export default function Page() {
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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <ProfileHeader user={currentUser} />
      </div>
      <div className="flex gap-8">
        <ProfileSidebar />
        <div className="flex-1 min-w-0">
          <ProfileContent defaultTab={activeTab} />
        </div>
      </div>
    </div>
  );
}