import type Stripe from "stripe"

import { getCustomerId } from "@/lib/stripe"

/**
 * Handles `checkout.session.completed` events.
 *
 * Fired when a customer successfully completes a Stripe Checkout session.
 * This is the primary event for fulfilling purchases — both one-time and subscription.
 *
 * Common actions:
 * - Provision access to the purchased product/plan
 * - Send a confirmation email
 * - Store the customer/subscription ID for future reference
 *
 * @see https://docs.stripe.com/api/events/types#event_types-checkout.session.completed
 */
export async function onCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const customerId = getCustomerId(session.customer)
  const customerEmail = session.customer_details?.email
  const mode = session.mode // "payment" | "subscription" | "setup"

  // TODO: Implement your fulfillment logic here.
  // This is where you provision access, send emails, update your database, etc.
  //
  // For subscriptions:
  //   const subscriptionId = getResourceId(session.subscription)
  //
  // For one-time payments:
  //   const paymentIntentId = getResourceId(session.payment_intent)

  void customerId
  void customerEmail
  void mode
}
