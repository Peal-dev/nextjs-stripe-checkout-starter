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

/**
 * Extracts a Stripe Customer ID from a customer field.
 *
 * Stripe object fields like `session.customer` or `subscription.customer`
 * can be a string ID, an expanded Customer/DeletedCustomer object, or null.
 * This helper safely extracts the ID without using `as` type assertions.
 */
export function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | null {
  if (!customer) return null
  if (typeof customer === "string") return customer
  return customer.id
}

/**
 * Extracts a Stripe resource ID from a field that may be a string or an expanded object.
 *
 * Useful for fields like `session.subscription`, `session.payment_intent`, etc.
 * that can be either a string ID or an expanded object with an `id` property.
 */
export function getResourceId(
  resource: string | { id: string } | null | undefined
): string | null {
  if (!resource) return null
  if (typeof resource === "string") return resource
  return resource.id
}
