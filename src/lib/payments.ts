import type { PaymentMode } from "@/types/payments";

import paymentsConfig from "../../payments.config";

/**
 * Server-side access to the payments configuration.
 * Use this in Server Components, Server Actions, and API routes.
 *
 * For client components, use the `usePaymentsConfig()` hook instead.
 */
export function getPaymentsConfig() {
  return paymentsConfig;
}

/**
 * Checks whether a given webhook event type should be processed
 * based on the current payment mode.
 */
export function isEventRelevant(eventType: string): boolean {
  const { mode } = paymentsConfig;
  return WEBHOOK_EVENTS_BY_MODE[mode].has(eventType);
}

/**
 * Webhook events that are relevant for each payment mode.
 * Events outside of the active set are acknowledged (200) but not processed.
 */
const WEBHOOK_EVENTS_BY_MODE: Record<PaymentMode, Set<string>> = {
  "one-time": new Set([
    "checkout.session.completed",
  ]),
  subscription: new Set([
    "checkout.session.completed",
    "invoice.paid",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]),
  hybrid: new Set([
    "checkout.session.completed",
    "invoice.paid",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]),
};
