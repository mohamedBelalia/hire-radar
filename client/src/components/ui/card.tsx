import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Render a stylized card container element.
 *
 * Produces a div styled as a flexible, bordered, rounded card (with dark-mode variants)
 * and sets data-slot="card". Additional div props and `className` are forwarded to the element.
 *
 * @returns A div element with card layout and styling applied
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border/50 py-6 shadow-sm dark:bg-card/80 dark:border-border/40",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Render the header region of a card with a responsive grid layout and slot-aware positioning.
 *
 * @param className - Additional CSS classes to merge with the header's default styling
 * @returns A `div` element configured as the card header
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the title area inside a Card.
 *
 * @param className - Additional CSS class names to merge with the title's base styles
 * @param props - Additional div props that are spread onto the rendered element
 * @returns The rendered div element serving as the card's title slot
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/**
 * Renders the card's description container.
 *
 * @returns A div element used to display the card's descriptive text.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Renders the card's action area for positioning interactive elements (e.g., buttons).
 *
 * @returns A `div` element serving as the card action slot with layout positioning classes applied.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the card's main content area.
 *
 * The element includes horizontal padding and merges any provided `className` with the base styles.
 *
 * @returns A div element used as the card content area with horizontal padding applied
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/**
 * Renders the footer area of a Card component.
 *
 * @param className - Additional CSS classes to apply to the footer container.
 * @returns The footer `div` element for the card with flex alignment, horizontal padding, and top padding when a top border is present.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};