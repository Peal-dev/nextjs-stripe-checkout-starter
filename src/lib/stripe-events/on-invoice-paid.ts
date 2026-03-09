import type Stripe from "stripe";

/**
 * Handles `invoice.paid` events.
 *
 * Fired when an invoice is successfully paid. For subscriptions, this fires
 * on every billing cycle — not just the first payment.
 *
 * Common actions:
 * - Extend access for the current billing period
 * - Update payment records
 * - Send a payment receipt
 *
 * @see https://docs.stripe.com/api/events/types#event_types-invoice.paid
 */
export async function onInvoicePaid(
  invoice: Stripe.Invoice
): Promise<void> {
  const customerId = invoice.customer as string | null;
  const subscriptionId =
    invoice.parent?.subscription_details?.subscription as string | null;
  const amountPaid = invoice.amount_paid;

  // TODO: Implement your renewal/payment logic here.
  // This is where you extend access, log payments, send receipts, etc.

  void customerId;
  void subscriptionId;
  void amountPaid;
}
