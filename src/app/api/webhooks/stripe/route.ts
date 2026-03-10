import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { z } from "zod"

import { constructWebhookEvent } from "@/lib/stripe"
import { isEventRelevant } from "@/lib/payments"
import {
  onCheckoutSessionCompleted,
  onInvoicePaid,
  onSubscriptionUpdated,
  onSubscriptionDeleted,
} from "@/lib/stripe-events"

/**
 * Zod schema for the webhook request headers.
 * Validates that the stripe-signature header is present and non-empty.
 */
const webhookHeadersSchema = z.object({
  "stripe-signature": z.string().min(1, "Signature must not be empty"),
})

/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * This is the ONLY API route in the project. All other server-side
 * mutations go through Server Actions.
 *
 * Security:
 * - Header validation via Zod — rejects requests without valid signature header
 * - Signature verification via `constructWebhookEvent()` — rejects tampered payloads
 * - Raw body parsing (no JSON middleware) to preserve the signature
 * - Events filtered by payment mode (one-time / subscription / hybrid)
 */
export async function POST(request: Request): Promise<NextResponse> {
  const headersParsed = webhookHeadersSchema.safeParse({
    "stripe-signature": request.headers.get("stripe-signature"),
  })

  if (!headersParsed.success) {
    return NextResponse.json(
      { error: "Missing or invalid stripe-signature header" },
      { status: 400 }
    )
  }

  const signature = headersParsed.data["stripe-signature"]
  const body = await request.text()

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(body, signature)
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    )
  }

  if (!isEventRelevant(event.type)) {
    return NextResponse.json({ received: true, skipped: event.type })
  }

  try {
    await routeEvent(event)
  } catch {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

/**
 * Routes a verified Stripe event to its corresponding handler.
 *
 * Note: Stripe's TypeScript types define `event.data.object` as an empty
 * `interface Object {}` — they do NOT narrow based on `event.type`.
 * Type assertions are the accepted pattern here, as the event type string
 * is verified by Stripe's signature check and the switch guarantees
 * the correct object shape for each case.
 */
async function routeEvent(event: Stripe.Event): Promise<void> {
  const obj = event.data.object

  switch (event.type) {
    case "checkout.session.completed":
      await onCheckoutSessionCompleted(
        obj as Stripe.Checkout.Session
      )
      break

    case "invoice.paid":
      await onInvoicePaid(obj as Stripe.Invoice)
      break

    case "customer.subscription.updated":
      await onSubscriptionUpdated(obj as Stripe.Subscription)
      break

    case "customer.subscription.deleted":
      await onSubscriptionDeleted(obj as Stripe.Subscription)
      break
  }
}
