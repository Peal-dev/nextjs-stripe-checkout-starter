"use client"

import type { BillingInterval } from "@/config/pricing"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface PricingToggleProps {
  interval: BillingInterval
  onToggle: () => void
  savingsLabel?: string
  className?: string
}

/**
 * Monthly/yearly billing toggle with optional savings badge.
 *
 * Uses shadcn Switch internally. The savings badge only appears
 * when `savingsLabel` is provided (e.g. "Save 17%").
 */
export function PricingToggle({
  interval,
  onToggle,
  savingsLabel,
  className,
}: PricingToggleProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          interval === "monthly"
            ? "text-foreground"
            : "text-muted-foreground"
        )}
      >
        Monthly
      </span>

      <Switch
        checked={interval === "yearly"}
        onCheckedChange={onToggle}
        aria-label="Toggle billing interval"
      />

      <span
        className={cn(
          "text-sm font-medium transition-colors",
          interval === "yearly"
            ? "text-foreground"
            : "text-muted-foreground"
        )}
      >
        Yearly
      </span>

      {savingsLabel && (
        <Badge variant="secondary" className="ml-1">
          {savingsLabel}
        </Badge>
      )}
    </div>
  )
}
