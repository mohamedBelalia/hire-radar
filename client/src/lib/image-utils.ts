/**
 * Utility functions for handling user profile images
 */

/**
 * Gets the API base URL for constructing full image URLs
 */
function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "";

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiBaseUrl) {
    // Remove trailing slash if present
    return apiBaseUrl.replace(/\/$/, "");
  }

  // Fallback: assume backend is on same origin or default port
  // In development, backend is usually on port 5000
  if (window.location.port === "3000") {
    return "http://localhost:5000";
  }

  return "";
}

/**
 * Validates and returns a valid image URL, or undefined if invalid
 * Adds cache-busting parameter for uploaded images to prevent browser caching
 * Converts relative URLs to absolute URLs using the API base URL
 */
export function getValidImageUrl(
  imageUrl: string | null | undefined,
): string | undefined {
  if (!imageUrl) return undefined;

  const trimmed = imageUrl.trim();

  // Check for invalid string values
  if (
    trimmed === "" ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "None"
  ) {
    return undefined;
  }

  // Check if it's a valid absolute URL
  try {
    const url = new URL(trimmed);
    // Only allow http/https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    // Add cache-busting for uploaded images (not OAuth images)
    if (!isGoogleImage(trimmed) && trimmed.includes("/uploads/")) {
      const separator = url.search ? "&" : "?";
      return `${trimmed}${separator}t=${Date.now()}`;
    }
    return trimmed;
  } catch {
    // If URL parsing fails, check if it's a relative URL (starts with /)
    if (trimmed.startsWith("/")) {
      // Relative URL - construct full URL using API base URL
      const apiBaseUrl = getApiBaseUrl();
      const fullUrl = apiBaseUrl ? `${apiBaseUrl}${trimmed}` : trimmed;

      // Add cache-busting for uploaded images
      if (trimmed.includes("/uploads/")) {
        const separator = fullUrl.includes("?") ? "&" : "?";
        return `${fullUrl}${separator}t=${Date.now()}`;
      }
      return fullUrl;
    }
    // Check if it's an absolute URL without protocol (shouldn't happen but handle it)
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return undefined;
  }
}

/**
 * Checks if an image URL is from Google (for CORS handling)
 */
export function isGoogleImage(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("googleusercontent.com") ||
      urlObj.hostname.includes("google.com")
    );
  } catch {
    return false;
  }
}
