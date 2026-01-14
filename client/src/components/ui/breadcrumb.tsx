import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a navigation element marked up as a breadcrumb container.
 *
 * @param props - Props passed to the underlying <nav> element; all standard nav attributes are supported and spread onto the element.
 * @returns The rendered `<nav>` element with `aria-label="breadcrumb"` and `data-slot="breadcrumb"`.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/**
 * Ordered list that wraps breadcrumb items with default styling and a data-slot hook.
 *
 * @returns An `<ol>` element with `data-slot="breadcrumb-list"`, default breadcrumb list classes combined with any `className`, and any additional props spread onto the element.
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb list item with default inline alignment and spacing.
 *
 * @returns A `<li>` element with `data-slot="breadcrumb-item"`, default alignment and gap classes merged with `className`, and any additional props spread onto the element.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/**
 * Render a breadcrumb link as an anchor or as a Radix `Slot`, applying default link styles.
 *
 * @param asChild - If `true`, renders a `Slot` component instead of an `<a>` element to allow parent-provided children to take the element role.
 * @param className - Additional CSS classes merged with the component's default hover and transition classes.
 * @param props - Any other props are forwarded to the rendered element (`<a>` or `Slot`).
 * @returns The JSX element for the breadcrumb link with data-slot="breadcrumb-link" and composed classes.
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

/**
 * Render the current page label within a breadcrumb with appropriate accessibility attributes.
 *
 * Renders a span with role="link", aria-disabled="true", aria-current="page", and default typography classes; merges any provided `className` and forwards remaining span props.
 *
 * @param props - Props forwarded to the span. `className` is merged with the component's default classes.
 * @returns A span element representing the active/current page in the breadcrumb.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb separator list item that displays either custom content or a default icon.
 *
 * The element is marked as presentation and hidden from assistive technology to indicate it is decorative.
 *
 * @param children - Optional custom node to render inside the separator; if omitted, a ChevronRight icon is used
 * @param className - Additional CSS classes merged with the component's default sizing class
 * @returns A `<li>` element used as a breadcrumb separator
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

/**
 * Renders an accessible ellipsis used to indicate collapsed breadcrumb items.
 *
 * The element is presentation-only visually (includes an icon) and contains a screen-reader-only
 * "More" label for accessibility. Additional `span` props and `className` are forwarded to the element.
 *
 * @returns A `span` element that visually displays an ellipsis (MoreHorizontal icon) and includes a hidden "More" label for screen readers.
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}