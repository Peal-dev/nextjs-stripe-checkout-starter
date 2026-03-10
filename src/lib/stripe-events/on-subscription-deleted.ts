import type Stripe from "stripe"

import { getCustomerId } from "@/lib/stripe"

/**
 * Handles `customer.subscription.deleted` events.
 *
 * Fired when a subscription is permanently canceled and the billing period ends.
 * This is the definitive signal to revoke access.
 *
 * Note: This fires AFTER the final period expires, not when the customer
 * clicks "cancel". For immediate cancellation intent, check `cancel_at_period_end`
 * in the `customer.subscription.updated` handler.
 *
 * Common actions:
 * - Revoke access to the product/plan
 * - Clean up related resources
 * - Send a "sorry to see you go" email
 *
 * @see https://docs.stripe.com/api/events/types#event_types-customer.subscription.deleted
 */
export async function onSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = getCustomerId(subscription.customer)
  const subscriptionId = subscription.id

  // TODO: Implement your access revocation logic here.
  // This is where you downgrade the user, remove access, send churn emails, etc.

  void customerId
  void subscriptionId
}
