"use server"

import { headers } from "next/headers"

import { stripe, getStripeRedirectUrl } from "@/lib/stripe"
import { getPaymentsConfig } from "@/lib/payments"
import {
  checkoutRateLimiter,
  portalRateLimiter,
  checkRateLimit,
} from "@/lib/rate-limit"
import { checkoutInputSchema, portalInputSchema } from "@/lib/validation"
import { plans } from "@/config/pricing"
import type { CheckoutResult, PortalResult } from "@/types/stripe"

/**
 * Extracts the client IP address from request headers.
 *
 * Checks common proxy headers in order of specificity:
 * 1. x-forwarded-for (standard proxy header, first IP is the client)
 * 2. x-real-ip (Nginx, some CDNs)
 * 3. Falls back to "unknown" (rate limiting will still work but
 *    all unknown clients share a single bucket)
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }

  return headersList.get("x-real-ip") ?? "unknown"
}

/**
 * Creates a Stripe Checkout Session and returns the hosted checkout URL.
 *
 * This Server Action is called from the client-side CheckoutButton.
 * It validates the price ID against the known plans config to prevent
 * arbitrary price ID injection.
 *
 * @param priceId - A Stripe Price ID from `src/config/pricing.ts`
 * @returns Discriminated union: `{ success: true, url }` or `{ success: false, error }`
 */
export async function createCheckoutSession(
  priceId: string
): Promise<CheckoutResult> {
  const ip = await getClientIp()
  const rateLimitResult = await checkRateLimit(checkoutRateLimiter, ip)

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
    }
  }

  const parsed = checkoutInputSchema.safeParse({ priceId })

  if (!parsed.success) {
    return { success: false, error: "Invalid price ID format" }
  }

  const validPriceId = parsed.data.priceId

  const plan = plans.find((p) => {
    if (p.type === "one-time") return p.priceId === validPriceId
    return (
      p.monthlyPriceId === validPriceId || p.yearlyPriceId === validPriceId
    )
  })

  if (!plan) {
    return { success: false, error: "Unknown price ID" }
  }

  const config = getPaymentsConfig()

  const isRecurring =
    plan.type === "recurring" &&
    (validPriceId === plan.monthlyPriceId ||
      validPriceId === plan.yearlyPriceId)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      line_items: [
        {
          price: validPriceId,
          quantity: 1,
        },
      ],
      success_url: getStripeRedirectUrl(
        `${config.redirects.success}?session_id={CHECKOUT_SESSION_ID}`
      ),
      cancel_url: getStripeRedirectUrl(config.redirects.cancel),
      ...(isRecurring && {
        subscription_data: {
          metadata: {
            planId: plan.id,
          },
        },
      }),
      ...(!isRecurring && {
        payment_intent_data: {
          metadata: {
            planId: plan.id,
          },
        },
      }),
    })

    if (!session.url) {
      return { success: false, error: "Failed to create checkout session" }
    }

    return { success: true, url: session.url }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

/**
 * Creates a Stripe Billing Portal session.
 *
 * Allows existing customers to:
 * - View and download invoices
 * - Update payment methods
 * - Change or cancel subscriptions
 * - Update billing information
 *
 * Prerequisites:
 * - Configure your portal at https://dashboard.stripe.com/settings/billing/portal
 * - The customer must have an existing Stripe Customer ID (cus_xxx)
 *
 * @param customerId - The Stripe Customer ID (cus_xxx)
 * @param returnPath - Optional relative path to redirect to after the portal session (defaults to "/")
 */
export async function createPortalSession(
  customerId: string,
  returnPath?: string
): Promise<PortalResult> {
  const ip = await getClientIp()
  const rateLimitResult = await checkRateLimit(portalRateLimiter, ip)

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
    }
  }

  const parsed = portalInputSchema.safeParse({ customerId, returnPath })

  if (!parsed.success) {
    return { success: false, error: "Invalid input" }
  }

  const config = getPaymentsConfig()

  if (!config.customerPortal.enabled) {
    return { success: false, error: "Customer portal is not enabled" }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: parsed.data.customerId,
      return_url: getStripeRedirectUrl(parsed.data.returnPath ?? "/"),
    })

    return { success: true, url: session.url }
  } catch {
    return {
      success: false,
      error: "Failed to create portal session. Please try again.",
    }
  }
}
