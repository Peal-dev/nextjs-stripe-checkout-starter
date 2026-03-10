import { z } from "zod"

/**
 * Centralized Zod schemas for all external input validation.
 *
 * Every piece of data that enters the system from outside (user input,
 * URL params, form data) MUST be validated through one of these schemas
 * before being used.
 *
 * Stripe webhook payloads are the exception — they are verified via
 * HMAC signature, not Zod, because the raw body must be preserved
 * for signature verification.
 */

// ---------------------------------------------------------------------------
// Stripe ID schemas
// ---------------------------------------------------------------------------

/**
 * Stripe Checkout Session ID.
 * Format: cs_test_xxx or cs_live_xxx
 */
export const stripeSessionIdSchema = z
  .string()
  .regex(
    /^cs_(test|live)_[a-zA-Z0-9]+$/,
    "Must be a valid Stripe Checkout Session ID"
  )

/**
 * Stripe Customer ID.
 * Format: cus_xxx
 */
export const stripeCustomerIdSchema = z
  .string()
  .startsWith("cus_", "Must be a valid Stripe Customer ID")
  .min(8, "Customer ID is too short")

/**
 * Stripe Price ID.
 * Format: price_xxx
 */
export const stripePriceIdSchema = z
  .string()
  .startsWith("price_", "Must be a valid Stripe Price ID")

// ---------------------------------------------------------------------------
// Server Action input schemas
// ---------------------------------------------------------------------------

/** Input for `createCheckoutSession`. */
export const checkoutInputSchema = z.object({
  priceId: stripePriceIdSchema,
})

/** Input for `createPortalSession`. */
export const portalInputSchema = z.object({
  customerId: stripeCustomerIdSchema,
  returnPath: z
    .string()
    .startsWith("/", "Return path must be a relative URL")
    .regex(/^\/[a-zA-Z0-9\-_/]*$/, "Return path contains invalid characters")
    .optional(),
})

// ---------------------------------------------------------------------------
// Page / URL param schemas
// ---------------------------------------------------------------------------

/** Query params for the checkout success page. */
export const successPageParamsSchema = z.object({
  session_id: stripeSessionIdSchema,
})

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type CheckoutInput = z.infer<typeof checkoutInputSchema>
export type PortalInput = z.infer<typeof portalInputSchema>
export type SuccessPageParams = z.infer<typeof successPageParamsSchema>
