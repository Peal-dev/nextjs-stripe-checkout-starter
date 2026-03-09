import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { constructWebhookEvent } from "@/lib/stripe";
import { isEventRelevant } from "@/lib/payments";
import {
  onCheckoutSessionCompleted,
  onInvoicePaid,
  onSubscriptionUpdated,
  onSubscriptionDeleted,
} from "@/lib/stripe-events";

/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * This is the ONLY API route in the project. All other server-side
 * mutations go through Server Actions.
 *
 * Security:
 * - Signature verification via `constructWebhookEvent()` — rejects tampered payloads
 * - Raw body parsing (no JSON middleware) to preserve the signature
 * - Events filtered by payment mode (one-time / subscription / hybrid)
 */
export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (!isEventRelevant(event.type)) {
    return NextResponse.json({ received: true, skipped: event.type });
  }

  try {
    await routeEvent(event);
  } catch {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

/**
 * Routes a verified Stripe event to its corresponding handler.
 */
async function routeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "invoice.paid":
      await onInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case "customer.subscription.updated":
      await onSubscriptionUpdated(
        event.data.object as Stripe.Subscription
      );
      break;

    case "customer.subscription.deleted":
      await onSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      );
      break;
  }
}
