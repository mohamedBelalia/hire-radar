"use client";

import { useParams } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hook";

/**
 * Selects the user ID to use for client requests.
 *
 * Prefers an `id` URL parameter, then the authenticated user's `id`, and finally the literal `"current"`.
 *
 * @returns The chosen user ID as a string: the `id` URL param if present, otherwise the current user's `id` converted to a string, otherwise `"current"`.
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