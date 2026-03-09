/**
 * Result type returned by Server Actions that create Stripe sessions.
 * Discriminated union ensures callers handle both success and error cases.
 */
export type CheckoutResult =
  | { success: true; url: string }
  | { success: false; error: string };

export type PortalResult =
  | { success: true; url: string }
  | { success: false; error: string };
