"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

/**
 * Renders a styled avatar root element for displaying user images or fallbacks.
 *
 * @returns A React element that serves as the avatar root with default circular sizing and overflow-hidden styling
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders an image optimized for use inside an Avatar.
 *
 * Applies a square aspect ratio, fills the available space, forwards all props to Radix's `AvatarPrimitive.Image`, and merges any provided `className`.
 *
 * @returns A React element rendering `AvatarPrimitive.Image` with avatar-specific styling
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Renders the avatar fallback element shown when an avatar image is unavailable.
 *
 * Applies default fallback styling, merges any provided `className`, and forwards remaining props to the underlying Radix `AvatarPrimitive.Fallback`.
 *
 * @returns A React element representing the avatar fallback content
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };