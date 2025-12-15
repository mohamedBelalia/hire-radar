"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Renders a collapsible root element while forwarding all received props.
 *
 * The rendered element includes a data-slot attribute set to "collapsible".
 *
 * @param props - Props to pass to the underlying collapsible root; all props are forwarded to the rendered element.
 * @returns A React element representing the collapsible root
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Renders a collapsible trigger element and forwards all received props.
 *
 * @param props - Props to apply to the trigger element; all props are forwarded to the underlying element.
 * @returns The rendered collapsible trigger element.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * Wraps Radix's CollapsibleContent primitive, forwarding all props and adding a `data-slot="collapsible-content"` attribute.
 *
 * @param props - Props forwarded to the underlying CollapsibleContent primitive
 * @returns The rendered CollapsibleContent element with the provided props and `data-slot="collapsible-content"`
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }