"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a responsive, full-width table inside a horizontally scrollable container.
 *
 * Renders a table element with data-slot="table" inside a wrapper div with data-slot="table-container"; accepts any standard table props and applies the provided `className` to the table's classes.
 *
 * @param className - Additional CSS classes to apply to the table element
 * @returns A table element wrapped in a responsive, horizontally scrollable container
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * Renders a styled table header element with a slot attribute for composition.
 *
 * @returns The `<thead>` element with `data-slot="table-header"` and merged classes
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * Renders a table body (`<tbody>`) with a slot attribute and default row styling.
 *
 * @returns The rendered `<tbody>` element with the component's default classes merged with `className` and all other props forwarded.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled table footer element that exposes a `data-slot="table-footer"` for slot composition.
 *
 * @param className - Additional CSS class names to merge with the component's default styling
 * @returns The configured `<tfoot>` element with merged classes and the `data-slot="table-footer"` attribute
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a table row element with standardized styling and a `data-slot="table-row"` attribute.
 *
 * @param className - Additional CSS classes appended to the default row styles
 * @returns The rendered `tr` element
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled table header cell (`th`) with a `data-slot="table-head"` attribute for slot-based composition.
 *
 * @returns A `th` element with preset styling classes and any provided `className` and props merged onto it.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled table cell element with slot metadata and consistent utility classes.
 *
 * @param className - Additional CSS classes to merge with the component's default classes.
 * @returns The rendered `td` element.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Render a styled <caption> element for tables with a slot attribute for composition.
 *
 * @returns A <caption> element with merged styling classes and `data-slot="table-caption"`
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}