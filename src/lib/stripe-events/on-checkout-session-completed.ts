import type Stripe from "stripe";

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
  const customerId = session.customer as string | null;
  const customerEmail = session.customer_details?.email;
  const mode = session.mode; // "payment" | "subscription" | "setup"

  // TODO: Implement your fulfillment logic here.
  // This is where you provision access, send emails, update your database, etc.
  //
  // For subscriptions:
  //   const subscriptionId = session.subscription as string;
  //
  // For one-time payments:
  //   const paymentIntentId = session.payment_intent as string;

  void customerId;
  void customerEmail;
  void mode;
}
