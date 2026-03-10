import { describe, it, expect } from "vitest"

import { isEventRelevant } from "./payments"

/**
 * Note: These tests validate the event filtering logic based on
 * the current `payments.config.ts` mode. If you change the mode,
 * adjust the expected results accordingly.
 */

describe("isEventRelevant", () => {
  it("accepts checkout.session.completed (relevant for all modes)", () => {
    expect(isEventRelevant("checkout.session.completed")).toBe(true)
  })

  it("rejects unknown event types", () => {
    expect(isEventRelevant("charge.succeeded")).toBe(false)
  })

  it("rejects completely invalid event types", () => {
    expect(isEventRelevant("not_a_real_event")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isEventRelevant("")).toBe(false)
  })

  // The following tests depend on the mode in payments.config.ts.
  // Currently set to "subscription" mode.
  it("accepts invoice.paid in subscription/hybrid mode", () => {
    expect(isEventRelevant("invoice.paid")).toBe(true)
  })

  it("accepts customer.subscription.updated in subscription/hybrid mode", () => {
    expect(isEventRelevant("customer.subscription.updated")).toBe(true)
  })

  it("accepts customer.subscription.deleted in subscription/hybrid mode", () => {
    expect(isEventRelevant("customer.subscription.deleted")).toBe(true)
  })
})
