export type PaymentMode = "one-time" | "subscription" | "hybrid";

export interface PaymentsConfig {
  /**
   * Controls which Stripe flows are active.
   *
   * - `"one-time"`      — Single-charge checkout only.
   * - `"subscription"`  — Recurring billing only.
   * - `"hybrid"`        — Both one-time and subscription flows.
   */
  mode: PaymentMode;

  /** Stripe Customer Portal settings. */
  customerPortal: {
    /** Enable the customer portal link/button in the UI. */
    enabled: boolean;
  };

  /** Post-checkout redirect paths (relative to app URL). */
  redirects: {
    success: string;
    cancel: string;
  };
}

/**
 * Derived boolean flags from the payments config.
 * Returned by `usePaymentsConfig()` for convenient conditional rendering.
 */
export interface PaymentsConfigFlags extends PaymentsConfig {
  /** True when mode is "one-time" or "hybrid". */
  supportsOneTime: boolean;
  /** True when mode is "subscription" or "hybrid". */
  supportsSubscriptions: boolean;
}
