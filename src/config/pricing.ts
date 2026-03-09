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

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface OneTimePlan {
  type: "one-time";
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  features: PricingFeature[];
  highlighted?: boolean;
}

export interface RecurringPlan {
  type: "recurring";
  id: string;
  name: string;
  description: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: PricingFeature[];
  highlighted?: boolean;
}

export type PricingPlan = OneTimePlan | RecurringPlan;

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
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Plans — replace these with your real Stripe Price IDs and pricing
// ---------------------------------------------------------------------------

export const plans: PricingPlan[] = [
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
];
