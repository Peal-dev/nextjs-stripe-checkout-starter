/**
 * Pricing plans configuration.
 *
 * Single source of truth for all pricing data rendered in the UI
 * and passed to Stripe Checkout.
 *
 * IMPORTANT: Replace the price IDs with your actual Stripe Price IDs
 * from https://dashboard.stripe.com/prices
 *
 * For one-time mode:
 *   - Use `type: "one-time"` and set `priceId` to a one-time Stripe Price.
 *
 * For subscription mode:
 *   - Use `type: "recurring"` and set `monthlyPriceId` / `yearlyPriceId`.
 *
 * For hybrid mode:
 *   - Mix both types in the same array.
 */

export type BillingInterval = "monthly" | "yearly"

export interface PricingFeature {
  text: string
  included: boolean
}

export interface OneTimePlan {
  type: "one-time"
  id: string
  name: string
  description: string
  priceId: string
  price: number
  currency: string
  features: PricingFeature[]
  highlighted?: boolean
}

export interface RecurringPlan {
  type: "recurring"
  id: string
  name: string
  description: string
  monthlyPriceId: string
  yearlyPriceId: string
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  features: PricingFeature[]
  highlighted?: boolean
}

export type PricingPlan = OneTimePlan | RecurringPlan

/**
 * Format a price for display.
 * Uses Intl.NumberFormat for proper locale-aware currency formatting.
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Returns the effective price ID for a plan based on the billing interval.
 * For one-time plans, the interval is ignored.
 */
export function getPriceId(
  plan: PricingPlan,
  interval: BillingInterval
): string {
  if (plan.type === "one-time") return plan.priceId
  return interval === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId
}

/**
 * Returns the display price for a plan based on the billing interval.
 * For one-time plans, the interval is ignored.
 */
export function getDisplayPrice(
  plan: PricingPlan,
  interval: BillingInterval
): number {
  if (plan.type === "one-time") return plan.price
  return interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
}

/**
 * Calculates the yearly savings percentage for a recurring plan.
 * Returns 0 for one-time plans.
 */
export function getYearlySavings(plan: PricingPlan): number {
  if (plan.type === "one-time") return 0
  const monthlyCostPerYear = plan.monthlyPrice * 12
  if (monthlyCostPerYear === 0) return 0
  return Math.round(
    ((monthlyCostPerYear - plan.yearlyPrice) / monthlyCostPerYear) * 100
  )
}

// ---------------------------------------------------------------------------
// One-time plans — used when payments.config.ts mode is "one-time"
// Replace these with your real Stripe Price IDs and pricing
// ---------------------------------------------------------------------------

export const oneTimePlans: OneTimePlan[] = [
  {
    type: "one-time",
    id: "starter",
    name: "Starter",
    description: "Perfect for trying things out.",
    priceId: "price_REPLACE_WITH_STARTER_PRICE_ID",
    price: 29,
    currency: "usd",
    features: [
      { text: "Core features", included: true },
      { text: "Email support", included: true },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
  },
  {
    type: "one-time",
    id: "pro",
    name: "Pro",
    description: "Best for professionals and small teams.",
    priceId: "price_REPLACE_WITH_PRO_PRICE_ID",
    price: 79,
    currency: "usd",
    highlighted: true,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Advanced features", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: false },
    ],
  },
  {
    type: "one-time",
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams with custom needs.",
    priceId: "price_REPLACE_WITH_ENTERPRISE_PRICE_ID",
    price: 199,
    currency: "usd",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited usage", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Subscription plans — used when payments.config.ts mode is "subscription"
// Replace these with your real Stripe Price IDs and pricing
// ---------------------------------------------------------------------------

export const subscriptionPlans: RecurringPlan[] = [
  {
    type: "recurring",
    id: "starter",
    name: "Starter",
    description: "Perfect for trying things out.",
    monthlyPriceId: "price_1T9DeXLiQmbXtxYXInaom2Uw",
    yearlyPriceId: "price_1T9DejLiQmbXtxYXzlbDeLqf",
    monthlyPrice: 9,
    yearlyPrice: 90,
    currency: "usd",
    features: [
      { text: "Core features", included: true },
      { text: "Email support", included: true },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
  },
  {
    type: "recurring",
    id: "pro",
    name: "Pro",
    description: "Best for professionals and small teams.",
    monthlyPriceId: "price_1T9F1DLiQmbXtxYXQig11mXQ",
    yearlyPriceId: "price_1T9F1PLiQmbXtxYXsONXGg8i",
    monthlyPrice: 29,
    yearlyPrice: 290,
    currency: "usd",
    highlighted: true,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Advanced features", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: false },
    ],
  },
  {
    type: "recurring",
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams with custom needs.",
    monthlyPriceId: "price_1T9F1mLiQmbXtxYX4T4aypQL",
    yearlyPriceId: "price_1T9F1vLiQmbXtxYXHqDac8s2",
    monthlyPrice: 79,
    yearlyPrice: 790,
    currency: "usd",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited usage", included: true },
      { text: "Priority support", included: true },
      { text: "Custom integrations", included: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// Unified plans array — consumed by the Server Action for validation.
// In hybrid mode, both arrays are merged.
// ---------------------------------------------------------------------------

export const plans: PricingPlan[] = [
  ...oneTimePlans,
  ...subscriptionPlans,
]
