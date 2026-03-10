import type Stripe from "stripe"

import { getCustomerId } from "@/lib/stripe"

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
  const customerId = getCustomerId(invoice.customer)
  const subscriptionId =
    invoice.parent?.subscription_details?.subscription ?? null
  const amountPaid = invoice.amount_paid

  // TODO: Implement your renewal/payment logic here.
  // This is where you extend access, log payments, send receipts, etc.

  void customerId
  void subscriptionId
  void amountPaid
}
