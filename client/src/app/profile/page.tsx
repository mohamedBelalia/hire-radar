"use client";

import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import ProfileSidebar from "./components/profile-sidebar";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";

/**
 * Render the profile settings page and synchronize the active tab with the URL hash and `"tab-change"` events.
 *
 * The component fetches the current user, maintains an `activeTab` state (defaults to `"profile"`), initializes it from the URL hash on mount, updates it when the hash changes or when a `"tab-change"` CustomEvent is dispatched, and cleans up listeners on unmount.
 *
 * @returns The profile settings page React element containing the header, sidebar, and content area with the active tab selected.
 */
export default function Page() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Handle hash changes for tab navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ["profile", "security", "notifications"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Handle custom tab-change event from sidebar
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("tab-change", handleTabChange as EventListener);

    // Set initial tab from hash
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