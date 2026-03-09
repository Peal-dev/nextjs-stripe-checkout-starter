import type Stripe from "stripe";

/**
 * Handles `customer.subscription.updated` events.
 *
 * Fired when a subscription is changed — plan upgrade/downgrade,
 * payment method update, trial ending, status change, etc.
 *
 * Common actions:
 * - Sync the new plan/status to your system
 * - Handle plan upgrades/downgrades (proration)
 * - Detect upcoming cancellations (`cancel_at_period_end`)
 *
 * @see https://docs.stripe.com/api/events/types#event_types-customer.subscription.updated
 */
export async function onSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const priceId = subscription.items.data[0]?.price.id;

  // TODO: Implement your subscription sync logic here.
  // This is where you update plan tiers, handle downgrades, detect cancellations, etc.

  void customerId;
  void status;
  void cancelAtPeriodEnd;
  void priceId;
}
