import { loadStripe, type Stripe } from "@stripe/stripe-js";

import { env } from "@/lib/env";

/**
 * Lazily-loaded Stripe.js client instance (browser-only).
 *
 * Uses a module-level promise so `loadStripe` is called at most once,
 * regardless of how many components import this module.
 *
 * This is used for Stripe Elements and Embedded Checkout.
 * Hosted Checkout (the default flow) does NOT need this — it
 * redirects to Stripe via a URL returned by the Server Action.
 *
 * Usage:
 * ```ts
 * const stripe = await getStripeClient();
 * const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
 * ```
 */
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeClient(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}
