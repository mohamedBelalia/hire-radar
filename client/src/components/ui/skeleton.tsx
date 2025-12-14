import { cn } from "@/lib/utils";

/**
 * Renders a rectangular animated skeleton placeholder.
 *
 * Applies the classes "bg-accent animate-pulse rounded-md", merges any provided `className`, and forwards remaining props to the root div.
 *
 * @returns The root div element used as the skeleton placeholder.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };