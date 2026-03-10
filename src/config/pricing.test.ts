import { describe, it, expect } from "vitest"

import type { OneTimePlan, RecurringPlan } from "./pricing"
import {
  formatPrice,
  getPriceId,
  getDisplayPrice,
  getYearlySavings,
} from "./pricing"

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const oneTimePlan: OneTimePlan = {
  type: "one-time",
  id: "starter",
  name: "Starter",
  description: "Test plan",
  priceId: "price_one_time",
  price: 29,
  currency: "usd",
  features: [{ text: "Feature 1", included: true }],
}

const recurringPlan: RecurringPlan = {
  type: "recurring",
  id: "pro",
  name: "Pro",
  description: "Test plan",
  monthlyPriceId: "price_monthly",
  yearlyPriceId: "price_yearly",
  monthlyPrice: 29,
  yearlyPrice: 290,
  currency: "usd",
  features: [{ text: "Feature 1", included: true }],
}

// ---------------------------------------------------------------------------
// formatPrice
// ---------------------------------------------------------------------------

describe("formatPrice", () => {
  it("formats USD prices correctly", () => {
    expect(formatPrice(29, "usd")).toBe("$29")
  })

  it("formats prices with decimals", () => {
    expect(formatPrice(29.99, "usd")).toBe("$29.99")
  })

  it("formats zero price", () => {
    expect(formatPrice(0, "usd")).toBe("$0")
  })

  it("formats EUR prices", () => {
    const result = formatPrice(49, "eur")
    expect(result).toContain("49")
  })

  it("formats large prices with no unnecessary decimals", () => {
    expect(formatPrice(1000, "usd")).toBe("$1,000")
  })
})

// ---------------------------------------------------------------------------
// getPriceId
// ---------------------------------------------------------------------------

describe("getPriceId", () => {
  it("returns priceId for one-time plans regardless of interval", () => {
    expect(getPriceId(oneTimePlan, "monthly")).toBe("price_one_time")
    expect(getPriceId(oneTimePlan, "yearly")).toBe("price_one_time")
  })

  it("returns monthly price ID for recurring plans", () => {
    expect(getPriceId(recurringPlan, "monthly")).toBe("price_monthly")
  })

  it("returns yearly price ID for recurring plans", () => {
    expect(getPriceId(recurringPlan, "yearly")).toBe("price_yearly")
  })
})

// ---------------------------------------------------------------------------
// getDisplayPrice
// ---------------------------------------------------------------------------

describe("getDisplayPrice", () => {
  it("returns price for one-time plans regardless of interval", () => {
    expect(getDisplayPrice(oneTimePlan, "monthly")).toBe(29)
    expect(getDisplayPrice(oneTimePlan, "yearly")).toBe(29)
  })

  it("returns monthly price for recurring plans with monthly interval", () => {
    expect(getDisplayPrice(recurringPlan, "monthly")).toBe(29)
  })

  it("returns yearly price for recurring plans with yearly interval", () => {
    expect(getDisplayPrice(recurringPlan, "yearly")).toBe(290)
  })
})

// ---------------------------------------------------------------------------
// getYearlySavings
// ---------------------------------------------------------------------------

describe("getYearlySavings", () => {
  it("returns 0 for one-time plans", () => {
    expect(getYearlySavings(oneTimePlan)).toBe(0)
  })

  it("calculates savings percentage correctly", () => {
    // Monthly: $29/mo = $348/year, Yearly: $290/year
    // Savings: (348 - 290) / 348 * 100 = 16.67% → 17% (rounded)
    expect(getYearlySavings(recurringPlan)).toBe(17)
  })

  it("returns 0 when yearly equals monthly * 12 (no savings)", () => {
    const noSavingsPlan: RecurringPlan = {
      ...recurringPlan,
      yearlyPrice: 348, // 29 * 12
    }
    expect(getYearlySavings(noSavingsPlan)).toBe(0)
  })

  it("returns 0 when monthly price is 0", () => {
    const freePlan: RecurringPlan = {
      ...recurringPlan,
      monthlyPrice: 0,
      yearlyPrice: 0,
    }
    expect(getYearlySavings(freePlan)).toBe(0)
  })

  it("handles 50% savings", () => {
    const halfOffPlan: RecurringPlan = {
      ...recurringPlan,
      monthlyPrice: 10,
      yearlyPrice: 60, // 50% off 120
    }
    expect(getYearlySavings(halfOffPlan)).toBe(50)
  })
})
