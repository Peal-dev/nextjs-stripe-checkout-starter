"use client";

import { useMemo } from "react";

import type { PaymentsConfigFlags } from "@/types/payments";
import paymentsConfig from "../../payments.config";

/**
 * Provides the global payments configuration with derived boolean flags.
 *
 * Usage:
 * ```tsx
 * const { mode, supportsOneTime, supportsSubscriptions } = usePaymentsConfig();
 *
 * {supportsSubscriptions && <PricingToggle />}
 * {supportsOneTime && <OneTimePurchaseCard />}
 * ```
 */
export function usePaymentsConfig(): PaymentsConfigFlags {
  return useMemo(
    () => ({
      ...paymentsConfig,
      supportsOneTime:
        paymentsConfig.mode === "one-time" || paymentsConfig.mode === "hybrid",
      supportsSubscriptions:
        paymentsConfig.mode === "subscription" ||
        paymentsConfig.mode === "hybrid",
    }),
    []
  );
}
