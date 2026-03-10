"use client"

import { usePaymentsConfig } from "@/hooks/use-payments-config"
import { usePricing } from "@/hooks/use-pricing"
import {
  oneTimePlans,
  subscriptionPlans,
  getYearlySavings,
} from "@/config/pricing"
import { PricingCard } from "@/components/pricing/PricingCard"
import { PricingToggle } from "@/components/pricing/PricingToggle"
import { cn } from "@/lib/utils"

interface PricingTableProps {
  className?: string
}

/**
 * Full pricing table that adapts to the payment mode.
 *
 * - `one-time` mode:  renders one-time plans, no toggle
 * - `subscription` mode: renders recurring plans with monthly/yearly toggle
 * - `hybrid` mode: renders both sections with toggle for subscriptions
 *
 * Reads the payment mode from `payments.config.ts` via `usePaymentsConfig()`.
 */
export function PricingTable({ className }: PricingTableProps) {
  const { supportsOneTime, supportsSubscriptions } = usePaymentsConfig()
  const { interval, toggleInterval } = usePricing()

  const maxSavings = Math.max(
    ...subscriptionPlans.map(getYearlySavings)
  )

  return (
    <div className={cn("w-full", className)}>
      {supportsSubscriptions && (
        <div className="mb-10 flex justify-center">
          <PricingToggle
            interval={interval}
            onToggle={toggleInterval}
            savingsLabel={
              maxSavings > 0 ? `Save up to ${maxSavings}%` : undefined
            }
          />
        </div>
      )}

      {supportsSubscriptions && (
        <section>
          {supportsOneTime && (
            <h2 className="mb-6 text-center text-lg font-semibold">
              Subscription Plans
            </h2>
          )}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                interval={interval}
              />
            ))}
          </div>
        </section>
      )}

      {supportsOneTime && (
        <section className={supportsSubscriptions ? "mt-16" : undefined}>
          {supportsSubscriptions && (
            <h2 className="mb-6 text-center text-lg font-semibold">
              One-Time Purchases
            </h2>
          )}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {oneTimePlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                interval={interval}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
