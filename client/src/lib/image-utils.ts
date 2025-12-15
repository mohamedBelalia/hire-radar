/**
 * Utility functions for handling user profile images
 */

/**
 * Validates and returns a valid image URL, or undefined if invalid
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

  // Check if it's a valid URL
  try {
    const url = new URL(trimmed);
    // Only allow http/https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return trimmed;
  } catch {
    // If URL parsing fails, it might still be a valid relative URL
    // But for OAuth images, they should be absolute URLs
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
