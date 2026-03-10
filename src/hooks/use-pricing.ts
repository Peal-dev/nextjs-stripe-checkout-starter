"use client"

import { useCallback, useState } from "react"

import type { BillingInterval } from "@/config/pricing"

/**
 * Manages the billing interval toggle state (monthly/yearly).
 *
 * Usage:
 * ```tsx
 * const { interval, setInterval, isYearly, toggleInterval } = usePricing();
 *
 * <PricingToggle interval={interval} onToggle={toggleInterval} />
 * <PricingCard plan={plan} interval={interval} />
 * ```
 */
export function usePricing(defaultInterval: BillingInterval = "monthly") {
  const [interval, setInterval] = useState<BillingInterval>(defaultInterval)

  const isYearly = interval === "yearly"
  const isMonthly = interval === "monthly"

  const toggleInterval = useCallback(() => {
    setInterval((prev) => (prev === "monthly" ? "yearly" : "monthly"))
  }, [])

  return {
    interval,
    setInterval,
    isYearly,
    isMonthly,
    toggleInterval,
  } as const
}
