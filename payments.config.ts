import type { PaymentsConfig } from "@/types/payments";

/**
 * Global payments configuration.
 *
 * This is the single source of truth for how your app handles payments.
 * Change the `mode` to control which Stripe flows are enabled:
 *
 * - `"one-time"`      — Sell products with a single checkout (no recurring billing).
 * - `"subscription"`  — Sell recurring plans (monthly/yearly).
 * - `"hybrid"`        — Support both one-time purchases and subscriptions.
 *
 * The mode determines:
 * - Which webhook events are processed
 * - Which pricing UI components are rendered
 * - Which checkout session parameters are used
 */
const config: PaymentsConfig = {
  mode: "subscription",

  /**
   * Stripe Customer Portal.
   * Only relevant for subscription and hybrid modes.
   * Lets customers manage billing, update payment methods, and cancel plans.
   */
  customerPortal: {
    enabled: true,
  },

  /**
   * Post-checkout redirect paths.
   * These are appended to NEXT_PUBLIC_APP_URL (or localhost:3000 in dev).
   */
  redirects: {
    success: "/checkout/success",
    cancel: "/checkout/cancel",
  },
};

export default config;
