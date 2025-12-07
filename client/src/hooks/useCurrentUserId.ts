"use client";

import { useParams } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hook";

/**
 * Hook to get the current user ID
 *
 * This hook attempts to get the user ID from:
 * 1. URL params (if viewing another user's profile)
 * 2. Current user from auth (OAuth/login)
 * 3. Fallback to 'current' (which the API should handle)
 */
export function useCurrentUserId(): string {
  const params = useParams();
  const { data: currentUser } = useCurrentUser();

  // If ID is in URL params, use it (for viewing other profiles)
  if (params?.id && typeof params.id === "string") {
    return params.id;
  }

  // Get from current user (OAuth/login)
  if (currentUser?.id) {
    return currentUser.id.toString();
  }

  // Fallback to 'current' - API should handle this
  return "current";
}
