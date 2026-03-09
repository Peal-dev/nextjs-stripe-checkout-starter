"use server";

import { z } from "zod";

import { stripe, getStripeRedirectUrl } from "@/lib/stripe";
import { getPaymentsConfig } from "@/lib/payments";
import { plans } from "@/config/pricing";
import type { CheckoutResult, PortalResult } from "@/types/stripe";
import { env } from "@/lib/env";

/**
 * Zod schema for checkout session input.
 * Validates and sanitizes user input before hitting the Stripe API.
 */
const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

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
  const parsed = checkoutSchema.safeParse({ priceId });

  if (!parsed.success) {
    return { success: false, error: "Invalid price ID" };
  }

  const validPriceId = parsed.data.priceId;

  const plan = plans.find((p) => {
    if (p.type === "one-time") return p.priceId === validPriceId;
    return (
      p.monthlyPriceId === validPriceId || p.yearlyPriceId === validPriceId
    );
  });

  if (!plan) {
    return { success: false, error: "Unknown price ID" };
  }

  const config = getPaymentsConfig();

  const isRecurring =
    plan.type === "recurring" &&
    (validPriceId === plan.monthlyPriceId ||
      validPriceId === plan.yearlyPriceId);

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
    });

    if (!session.url) {
      return { success: false, error: "Failed to create checkout session" };
    }

    return { success: true, url: session.url };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Creates a Stripe Customer Portal session.
 *
 * Allows existing customers to manage billing, update payment methods,
 * and cancel subscriptions. Requires a Stripe Customer ID.
 *
 * @param customerId - The Stripe Customer ID (cus_xxx)
 */
export async function createPortalSession(
  customerId: string
): Promise<PortalResult> {
  const portalUrl = env.STRIPE_CUSTOMER_PORTAL_URL;

  if (!portalUrl) {
    return { success: false, error: "Customer portal is not configured" };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: getStripeRedirectUrl("/"),
    });

    return { success: true, url: session.url };
  } catch {
    return { success: false, error: "Failed to create portal session" };
  }
}
