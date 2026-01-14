"use client";

import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import ProfileSidebar from "@/app/profile/components/profile-sidebar";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";

/**
 * Render the employer profile page and keep the active profile tab in sync with the URL hash and "tab-change" events.
 *
 * The component reads the current user, initializes the active tab from the URL hash (if it equals "profile", "security", or "notifications"), and updates the active tab when the URL hash changes or when a "tab-change" CustomEvent is dispatched.
 *
 * @returns The page's React element containing ProfileHeader, ProfileSidebar, and ProfileContent where `ProfileContent` receives the currently active tab as its `defaultTab` prop.
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