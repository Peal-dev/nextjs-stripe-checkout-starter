import { describe, it, expect } from "vitest"

import {
  stripeSessionIdSchema,
  stripeCustomerIdSchema,
  stripePriceIdSchema,
  checkoutInputSchema,
  portalInputSchema,
  successPageParamsSchema,
} from "./validation"

// ---------------------------------------------------------------------------
// stripeSessionIdSchema
// ---------------------------------------------------------------------------

describe("stripeSessionIdSchema", () => {
  it("accepts valid test session IDs", () => {
    const result = stripeSessionIdSchema.safeParse("cs_test_abc123XYZ")
    expect(result.success).toBe(true)
  })

  it("accepts valid live session IDs", () => {
    const result = stripeSessionIdSchema.safeParse("cs_live_def456ABC")
    expect(result.success).toBe(true)
  })

  it("rejects session IDs without prefix", () => {
    const result = stripeSessionIdSchema.safeParse("abc123")
    expect(result.success).toBe(false)
  })

  it("rejects empty strings", () => {
    const result = stripeSessionIdSchema.safeParse("")
    expect(result.success).toBe(false)
  })

  it("rejects session IDs with invalid mode", () => {
    const result = stripeSessionIdSchema.safeParse("cs_staging_abc123")
    expect(result.success).toBe(false)
  })

  it("rejects session IDs with special characters", () => {
    const result = stripeSessionIdSchema.safeParse("cs_test_abc!@#")
    expect(result.success).toBe(false)
  })

  it("rejects non-string values", () => {
    const result = stripeSessionIdSchema.safeParse(12345)
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// stripeCustomerIdSchema
// ---------------------------------------------------------------------------

describe("stripeCustomerIdSchema", () => {
  it("accepts valid customer IDs", () => {
    const result = stripeCustomerIdSchema.safeParse("cus_abc123XYZ")
    expect(result.success).toBe(true)
  })

  it("rejects IDs without cus_ prefix", () => {
    const result = stripeCustomerIdSchema.safeParse("customer_abc123")
    expect(result.success).toBe(false)
  })

  it("rejects IDs that are too short", () => {
    const result = stripeCustomerIdSchema.safeParse("cus_ab")
    expect(result.success).toBe(false)
  })

  it("rejects empty strings", () => {
    const result = stripeCustomerIdSchema.safeParse("")
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// stripePriceIdSchema
// ---------------------------------------------------------------------------

describe("stripePriceIdSchema", () => {
  it("accepts valid price IDs", () => {
    const result = stripePriceIdSchema.safeParse("price_1234abcDEF")
    expect(result.success).toBe(true)
  })

  it("rejects IDs without price_ prefix", () => {
    const result = stripePriceIdSchema.safeParse("prod_1234abcDEF")
    expect(result.success).toBe(false)
  })

  it("rejects empty strings", () => {
    const result = stripePriceIdSchema.safeParse("")
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// checkoutInputSchema
// ---------------------------------------------------------------------------

describe("checkoutInputSchema", () => {
  it("accepts valid checkout input", () => {
    const result = checkoutInputSchema.safeParse({
      priceId: "price_abc123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing priceId", () => {
    const result = checkoutInputSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects invalid priceId format", () => {
    const result = checkoutInputSchema.safeParse({
      priceId: "invalid_id",
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// portalInputSchema
// ---------------------------------------------------------------------------

describe("portalInputSchema", () => {
  it("accepts valid portal input with returnPath", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
      returnPath: "/dashboard",
    })
    expect(result.success).toBe(true)
  })

  it("accepts valid portal input without returnPath", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid customerId", () => {
    const result = portalInputSchema.safeParse({
      customerId: "invalid",
    })
    expect(result.success).toBe(false)
  })

  it("rejects returnPath without leading slash", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
      returnPath: "dashboard",
    })
    expect(result.success).toBe(false)
  })

  it("rejects returnPath with query parameters (open redirect prevention)", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
      returnPath: "/callback?url=https://evil.com",
    })
    expect(result.success).toBe(false)
  })

  it("rejects absolute URL in returnPath (open redirect prevention)", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
      returnPath: "https://evil.com",
    })
    expect(result.success).toBe(false)
  })

  it("accepts nested returnPath", () => {
    const result = portalInputSchema.safeParse({
      customerId: "cus_abc123XYZ",
      returnPath: "/checkout/success",
    })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// successPageParamsSchema
// ---------------------------------------------------------------------------

describe("successPageParamsSchema", () => {
  it("accepts valid success page params", () => {
    const result = successPageParamsSchema.safeParse({
      session_id: "cs_test_abc123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing session_id", () => {
    const result = successPageParamsSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it("rejects invalid session_id", () => {
    const result = successPageParamsSchema.safeParse({
      session_id: "invalid",
    })
    expect(result.success).toBe(false)
  })
})
