import Stripe from "stripe";

import { env } from "@/lib/env";

/**
 * Server-side Stripe client instance.
 *
 * This module MUST only be imported in server contexts:
 * - Server Components
 * - Server Actions (src/actions/)
 * - API Routes (src/app/api/)
 *
 * Importing this in a 'use client' component will throw at build time
 * because `env.STRIPE_SECRET_KEY` is a server-only variable.
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});

/**
 * Constructs and verifies a Stripe webhook event from the raw request body.
 *
 * @throws {Stripe.errors.StripeSignatureVerificationError} if signature is invalid
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

/**
 * Resolves the absolute URL for Stripe redirect callbacks (success/cancel).
 * Falls back to localhost in development when NEXT_PUBLIC_APP_URL is not set.
 */
export function getStripeRedirectUrl(path: string): string {
  const baseUrl =
    env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}
