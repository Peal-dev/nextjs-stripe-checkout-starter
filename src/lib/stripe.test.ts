import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Tests for Stripe utility functions.
 *
 * We mock the env module to avoid requiring real Stripe keys
 * in the test environment.
 */

vi.mock("@/lib/env", () => ({
  env: {
    STRIPE_SECRET_KEY: "sk_test_mock",
    STRIPE_WEBHOOK_SECRET: "whsec_mock",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_mock",
    NEXT_PUBLIC_APP_URL: undefined,
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
    NODE_ENV: "test",
  },
}))

// Import after mock is set up
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let getCustomerId: (typeof import("./stripe"))["getCustomerId"]
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let getResourceId: (typeof import("./stripe"))["getResourceId"]
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let getStripeRedirectUrl: (typeof import("./stripe"))["getStripeRedirectUrl"]

beforeEach(async () => {
  const mod = await import("./stripe")
  getCustomerId = mod.getCustomerId
  getResourceId = mod.getResourceId
  getStripeRedirectUrl = mod.getStripeRedirectUrl
})

// ---------------------------------------------------------------------------
// getCustomerId
// ---------------------------------------------------------------------------

describe("getCustomerId", () => {
  it("returns the string when customer is a string ID", () => {
    expect(getCustomerId("cus_abc123")).toBe("cus_abc123")
  })

  it("returns id from expanded Customer object", () => {
    // Simulate a minimal Stripe Customer-like object
    const customer = {
      id: "cus_abc123",
      object: "customer",
      deleted: undefined,
    }
    expect(getCustomerId(customer as unknown as Parameters<typeof getCustomerId>[0])).toBe("cus_abc123")
  })

  it("returns null for null input", () => {
    expect(getCustomerId(null)).toBeNull()
  })

  it("returns null for undefined input", () => {
    expect(getCustomerId(undefined)).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(getCustomerId("")).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// getResourceId
// ---------------------------------------------------------------------------

describe("getResourceId", () => {
  it("returns the string when resource is a string ID", () => {
    expect(getResourceId("sub_abc123")).toBe("sub_abc123")
  })

  it("returns id from expanded object", () => {
    expect(getResourceId({ id: "sub_abc123" })).toBe("sub_abc123")
  })

  it("returns null for null input", () => {
    expect(getResourceId(null)).toBeNull()
  })

  it("returns null for undefined input", () => {
    expect(getResourceId(undefined)).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(getResourceId("")).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// getStripeRedirectUrl
// ---------------------------------------------------------------------------

describe("getStripeRedirectUrl", () => {
  it("falls back to localhost when NEXT_PUBLIC_APP_URL is not set", () => {
    expect(getStripeRedirectUrl("/checkout/success")).toBe(
      "http://localhost:3000/checkout/success"
    )
  })

  it("appends path to base URL", () => {
    expect(getStripeRedirectUrl("/")).toBe("http://localhost:3000/")
  })

  it("handles paths with query parameters", () => {
    expect(
      getStripeRedirectUrl("/checkout/success?session_id=cs_test_123")
    ).toBe("http://localhost:3000/checkout/success?session_id=cs_test_123")
  })
})
