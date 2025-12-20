"use client";

import ProfileContent from "./components/profile-content";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";

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
    <ProfileContent defaultTab={activeTab} />
  );
}
