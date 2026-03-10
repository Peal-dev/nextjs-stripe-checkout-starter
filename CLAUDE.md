# CLAUDE.md — Working with this Template (Claude Code Guide)

This file teaches you how to use, extend, and test this codebase. Read this before writing any code.

---

## Part 1: How the Template Works

### The Big Picture

This is a Next.js 16 Stripe checkout template. The user clones it, sets their Stripe keys, configures pricing plans, and has a working payment system. There is no database and no auth — Stripe is the source of truth.

The data flow is:

```
payments.config.ts (payment mode)
        +
src/config/pricing.ts (plans, prices, features)
        ↓
PricingTable → PricingCard → CheckoutButton
        ↓ (Server Action)
createCheckoutSession() → Stripe Checkout (hosted page)
        ↓ (after payment)
Success page ← Webhook handler processes events
```

### Key Files and What They Do

| File | Role | Server/Client |
|---|---|---|
| `payments.config.ts` | Single source of truth for payment mode (`"one-time"` / `"subscription"` / `"hybrid"`) | Both |
| `src/config/pricing.ts` | All plans, prices, features, and price IDs. Also exports utility functions: `formatPrice`, `getPriceId`, `getDisplayPrice`, `getYearlySavings` | Both |
| `src/lib/env.ts` | Type-safe env vars via `@t3-oss/env-nextjs`. ALL env access goes through `env` object | Server |
| `src/lib/stripe.ts` | Stripe server SDK instance + helpers: `constructWebhookEvent`, `getStripeRedirectUrl`, `getCustomerId`, `getResourceId` | Server only |
| `src/lib/stripe-client.ts` | Stripe.js browser SDK (lazy-loaded). Only needed for Embedded Checkout, NOT for hosted checkout | Client only |
| `src/lib/validation.ts` | All Zod schemas for external input. Every piece of user input must pass through these | Both |
| `src/lib/payments.ts` | `getPaymentsConfig()` for server, `isEventRelevant()` for webhook filtering | Server |
| `src/lib/rate-limit.ts` | Upstash Redis rate limiter. Returns `null` when Upstash is not configured (graceful degradation) | Server |
| `src/lib/utils.ts` | `cn()` helper — `clsx` + `tailwind-merge` | Both |
| `src/actions/checkout.ts` | Server Actions: `createCheckoutSession()`, `createPortalSession()` | Server |
| `src/app/api/webhooks/stripe/route.ts` | Webhook handler — the ONLY API route in the project | Server |
| `src/lib/stripe-events/*.ts` | Individual webhook event handlers (currently stubs with TODOs) | Server |
| `src/hooks/use-payments-config.ts` | Client-side hook for `payments.config.ts` with derived flags | Client |
| `src/hooks/use-pricing.ts` | Billing interval toggle state (monthly/yearly) | Client |

---

## Part 2: How to Use Each Function Correctly

### Environment Variables — `src/lib/env.ts`

**NEVER use `process.env` directly.** Always import from `env.ts`:

```ts
// CORRECT
import { env } from "@/lib/env"
const key = env.STRIPE_SECRET_KEY

// WRONG — will work but violates the project convention and skips validation
const key = process.env.STRIPE_SECRET_KEY
```

To add a new env var:
1. Add the Zod schema to `src/lib/env.ts` (in `server` or `client`)
2. Add the runtime mapping in `runtimeEnv`
3. Add it to `.env.example` with a comment
4. Client vars MUST start with `NEXT_PUBLIC_`

```ts
// Adding a server var:
server: {
  MY_NEW_VAR: z.string().min(1),
},
runtimeEnv: {
  MY_NEW_VAR: process.env.MY_NEW_VAR,
},
```

### Stripe Server SDK — `src/lib/stripe.ts`

**NEVER import this in a `'use client'` component.** It will fail at build time.

```ts
// CORRECT — in a Server Component, Server Action, or API route
import { stripe } from "@/lib/stripe"
const session = await stripe.checkout.sessions.retrieve(sessionId)

// CORRECT — extracting a customer ID from a Stripe object
import { getCustomerId, getResourceId } from "@/lib/stripe"
const customerId = getCustomerId(session.customer)     // string | null
const subscriptionId = getResourceId(session.subscription) // string | null

// CORRECT — building redirect URLs
import { getStripeRedirectUrl } from "@/lib/stripe"
const url = getStripeRedirectUrl("/checkout/success")
// Returns "https://yoursite.com/checkout/success" in production
// Returns "http://localhost:3000/checkout/success" in development
```

**Why `getCustomerId` and `getResourceId` exist:** Stripe fields like `session.customer` can be a string ID, an expanded object, or null. These helpers extract the ID safely without `as` type assertions (which are banned by ESLint in this project).

### Stripe Client SDK — `src/lib/stripe-client.ts`

Only used if you need Stripe Elements or Embedded Checkout. The default hosted checkout flow does NOT need this.

```ts
// Only import in 'use client' components
import { getStripeClient } from "@/lib/stripe-client"

const stripe = await getStripeClient()
// Use for Elements, Embedded Checkout, etc.
```

### Validation — `src/lib/validation.ts`

**EVERY external input must be validated with Zod.** The schemas are centralized here.

```ts
import { checkoutInputSchema, portalInputSchema } from "@/lib/validation"

// Validating user input — always use safeParse, never parse
const result = checkoutInputSchema.safeParse({ priceId: userInput })
if (!result.success) {
  return { success: false, error: "Invalid input" }
}
// result.data is now typed and safe to use
const { priceId } = result.data
```

To add a new schema:
1. Define it in `src/lib/validation.ts`
2. Export the inferred type: `export type MyInput = z.infer<typeof myInputSchema>`
3. Add tests in `src/lib/validation.test.ts`

**Security patterns to follow:**
- Path fields: validate with `startsWith("/")` + regex to block open redirects
- Stripe IDs: validate prefixes (`price_`, `cus_`, `cs_test_`, `cs_live_`)
- Never trust raw URL params or form data without schema validation

### Pricing Config — `src/config/pricing.ts`

This is the source of truth for what appears on the pricing page and what gets sent to Stripe.

```ts
import { plans, oneTimePlans, subscriptionPlans } from "@/config/pricing"
import { formatPrice, getPriceId, getDisplayPrice, getYearlySavings } from "@/config/pricing"
import type { PricingPlan, OneTimePlan, RecurringPlan, BillingInterval } from "@/config/pricing"

// Format a price for display
formatPrice(29, "usd")           // "$29"
formatPrice(29.99, "usd")       // "$29.99"
formatPrice(1000, "usd")        // "$1,000"

// Get the correct price ID for a plan + interval
getPriceId(plan, "monthly")      // "price_xxx" (monthly ID for recurring, priceId for one-time)
getPriceId(plan, "yearly")       // "price_yyy" (yearly ID for recurring, priceId for one-time)

// Get the display price number
getDisplayPrice(plan, "monthly") // 29 (number, not formatted)
getDisplayPrice(plan, "yearly")  // 290

// Calculate yearly savings percentage
getYearlySavings(recurringPlan)  // 17 (means 17% savings vs monthly)
getYearlySavings(oneTimePlan)    // 0 (always 0 for one-time)
```

**Plan types are a discriminated union.** Always narrow before accessing plan-specific fields:

```ts
function handlePlan(plan: PricingPlan) {
  if (plan.type === "one-time") {
    // TypeScript knows this is OneTimePlan
    console.log(plan.priceId, plan.price)
  } else {
    // TypeScript knows this is RecurringPlan
    console.log(plan.monthlyPriceId, plan.yearlyPriceId)
  }
}
```

**To add a new plan:** Add it to `oneTimePlans` or `subscriptionPlans` in `src/config/pricing.ts`. Replace the `price_REPLACE_*` placeholder with a real Stripe Price ID. The `plans` array exports both arrays merged — it is used by the Server Action to validate price IDs.

### Payment Mode — `payments.config.ts`

```ts
import paymentsConfig from "../../payments.config"   // Server-side (relative import)
import { usePaymentsConfig } from "@/hooks/use-payments-config"  // Client-side hook
import { getPaymentsConfig } from "@/lib/payments"   // Server-side helper
```

The mode affects the entire app:

| Mode | `supportsOneTime` | `supportsSubscriptions` | Webhook events |
|---|---|---|---|
| `"one-time"` | `true` | `false` | `checkout.session.completed` only |
| `"subscription"` | `false` | `true` | All 4 events |
| `"hybrid"` | `true` | `true` | All 4 events |

**In client components, use the hook:**

```tsx
"use client"
import { usePaymentsConfig } from "@/hooks/use-payments-config"

export function MyComponent() {
  const { mode, supportsOneTime, supportsSubscriptions, customerPortal } = usePaymentsConfig()

  return (
    <>
      {supportsSubscriptions && <BillingToggle />}
      {supportsOneTime && <OneTimePurchaseSection />}
      {customerPortal.enabled && <ManageBillingButton />}
    </>
  )
}
```

**In server code, use the getter:**

```ts
import { getPaymentsConfig } from "@/lib/payments"

const config = getPaymentsConfig()
if (config.customerPortal.enabled) { /* ... */ }
```

### Server Actions — `src/actions/checkout.ts`

Server Actions are the ONLY way to create Stripe sessions. Never create API routes for this.

**Calling from a client component:**

```tsx
"use client"
import { createCheckoutSession } from "@/actions/checkout"
import { createPortalSession } from "@/actions/checkout"

// Checkout — returns { success: true, url } or { success: false, error }
const result = await createCheckoutSession("price_xxx")
if (result.success) {
  window.location.href = result.url  // Redirect to Stripe
} else {
  setError(result.error)  // Show error to user
}

// Portal — same pattern
const result = await createPortalSession("cus_xxx", "/dashboard")
```

**The return types are discriminated unions** (`CheckoutResult`, `PortalResult`). Always check `result.success` before accessing `result.url` or `result.error`.

**What happens inside `createCheckoutSession`:**
1. Rate limit check (Upstash, skipped if not configured)
2. Zod validation of the price ID format
3. Allowlist check: price ID must exist in `plans` array from `pricing.ts`
4. Stripe session creation with correct `mode` (`"payment"` vs `"subscription"`)
5. Returns the hosted checkout URL

### Rate Limiting — `src/lib/rate-limit.ts`

```ts
import { checkoutRateLimiter, portalRateLimiter, checkRateLimit } from "@/lib/rate-limit"

// Check rate limit before performing an action
const result = await checkRateLimit(checkoutRateLimiter, clientIpAddress)

if (!result.allowed) {
  return { success: false, error: `Try again in ${result.retryAfter} seconds.` }
}
```

**Graceful degradation:** When `UPSTASH_REDIS_REST_URL` is not set, the limiters are `null`, and `checkRateLimit(null, id)` always returns `{ allowed: true }`. No need to check if Upstash is configured.

**Limits:**
- Checkout: 10 requests / 60s per IP (sliding window)
- Portal: 20 requests / 60s per IP (sliding window)

### Webhook Handlers — `src/lib/stripe-events/*.ts`

These are stubs. Each handler receives the typed Stripe object and has TODO comments explaining what to implement.

```ts
// src/lib/stripe-events/on-checkout-session-completed.ts
export async function onCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const customerId = getCustomerId(session.customer)  // string | null
  const customerEmail = session.customer_details?.email
  const mode = session.mode  // "payment" | "subscription" | "setup"

  // TODO: your logic here (save to DB, send email, provision access)
}
```

**When implementing a handler:**
1. Use `getCustomerId()` to extract the customer ID (never use `as string`)
2. Use `getResourceId()` to extract subscription/payment intent IDs
3. Always handle the `null` case (customer may not exist)
4. The handler is `async` — you can `await` database calls, API calls, etc.
5. If the handler throws, the webhook returns 500 and Stripe will retry

**The 4 events and when they fire:**

| Event | When | Use for |
|---|---|---|
| `checkout.session.completed` | Customer completes payment | Provision access, send confirmation |
| `invoice.paid` | Every billing cycle (not just first) | Extend access, log payment |
| `customer.subscription.updated` | Plan change, status change, cancel intent | Sync plan tier, detect cancellation |
| `customer.subscription.deleted` | Subscription period ends after cancellation | Revoke access |

### UI Components

**`CheckoutButton`** — triggers a Stripe Checkout redirect:

```tsx
import { CheckoutButton } from "@/components/checkout/CheckoutButton"

<CheckoutButton priceId="price_xxx" variant="default">
  Subscribe Now
</CheckoutButton>
```

Handles loading state (spinner + disabled) and error display (inline alert) automatically.

**`CustomerPortalButton`** — opens Stripe Billing Portal:

```tsx
import { CustomerPortalButton } from "@/components/checkout/CustomerPortalButton"

<CustomerPortalButton customerId="cus_xxx" returnPath="/dashboard">
  Manage Billing
</CustomerPortalButton>
```

Requires `customerPortal.enabled: true` in `payments.config.ts`.

**`PricingTable`** — renders the full pricing page:

```tsx
import { PricingTable } from "@/components/pricing/PricingTable"

<PricingTable />  // Automatically adapts to payment mode
```

This is the only component you need. It handles:
- Reading the payment mode via `usePaymentsConfig()`
- Showing/hiding the billing toggle
- Rendering the correct plan cards
- Calculating yearly savings

### Hooks

**`usePricing()`** — manages monthly/yearly toggle:

```tsx
const { interval, isYearly, isMonthly, toggleInterval } = usePricing()
// interval: "monthly" | "yearly"
// Pass to PricingCard and PricingToggle
```

**`usePaymentsConfig()`** — reads payment mode with derived flags:

```tsx
const { mode, supportsOneTime, supportsSubscriptions, customerPortal, redirects } = usePaymentsConfig()
```

### CSS and Styling

- **ONLY Tailwind CSS.** No CSS modules, no inline `style` props.
- Use `cn()` for conditional classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class", className)} />
```

- **shadcn/ui components** are in `src/components/ui/`. NEVER modify them directly — extend by wrapping.

### Error Handling

- Every route segment has an `error.tsx` boundary
- Server Actions return discriminated unions (`{ success: true, ... } | { success: false, error }`) — never throw
- Client components display errors inline with `role="alert"` for accessibility
- The webhook handler returns proper HTTP status codes (400 for bad signature, 500 for handler failure)

### Adding a New Page

1. Create `src/app/your-route/page.tsx` (Server Component by default)
2. Create `src/app/your-route/loading.tsx` (skeleton UI)
3. Create `src/app/your-route/error.tsx` (error boundary)
4. Add E2E test in `e2e/your-route.spec.ts`

### Adding a New Server Action

1. Add the function to `src/actions/checkout.ts` (or create a new file in `src/actions/`)
2. Mark the file with `"use server"` at the top
3. Add a Zod schema to `src/lib/validation.ts` for the input
4. Add rate limiting if the action creates external resources
5. Return a discriminated union type (define it in `src/types/`)
6. Add unit tests with env mocking

---

## Part 3: Testing

### Quick Reference

```bash
bun run test              # Run all unit tests once
bun run test:watch        # Watch mode
bun run test:coverage     # With V8 coverage
bun run test:e2e          # E2E headless (auto-starts dev server)
bun run test:e2e:ui       # E2E with Playwright UI
```

### Stack

- **Unit/integration**: Vitest 4 + jsdom + @testing-library/react + @testing-library/jest-dom
- **E2E**: Playwright (Chromium only)
- **Package manager**: bun (use `bunx` instead of `npx`)

### File Placement

- Unit tests live **next to** their source file: `src/lib/stripe.ts` → `src/lib/stripe.test.ts`
- E2E tests live in the `e2e/` directory at project root
- Test setup file: `src/test/setup.ts`

### Config: `vitest.config.ts`

- Environment: `jsdom`
- Globals: `true` (no need to import `describe`/`it`/`expect`, but we do it explicitly for clarity)
- Path alias: `@/` → `./src/`
- Setup: `src/test/setup.ts` (loads `@testing-library/jest-dom/vitest`)
- Include: `src/**/*.test.{ts,tsx}`
- Coverage: `src/lib/**`, `src/config/**`, `src/hooks/**` (excludes `src/components/ui/**`)

### Writing a Unit Test

Always follow this pattern:

```ts
import { describe, it, expect } from "vitest"

import { myFunction } from "./my-module"

describe("myFunction", () => {
  it("does the expected thing", () => {
    expect(myFunction("input")).toBe("output")
  })
})
```

**Import ordering matters** — ESLint enforces it:
1. vitest imports (`import { describe, it, expect, vi } from "vitest"`)
2. Blank line
3. Source imports (`import { thing } from "./module"`)

Use `// ---------------------------------------------------------------------------` comment dividers between `describe` blocks when a file has multiple (see existing tests for the style).

### Mocking the `env` Module

Any module that imports from `@/lib/env` (directly or transitively) will trigger `@t3-oss/env-nextjs` validation at import time. This **will fail** in tests because there are no real Stripe keys.

**You MUST mock `@/lib/env` before importing the module under test:**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"

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

// Import AFTER the mock is set up
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let myFunction: (typeof import("./my-module"))["myFunction"]

beforeEach(async () => {
  const mod = await import("./my-module")
  myFunction = mod.myFunction
})
```

**This applies to**: `stripe.ts`, `rate-limit.ts`, `payments.ts`, `checkout.ts`, and anything that imports them.

**This does NOT apply to**: `validation.ts`, `utils.ts`, `pricing.ts` — these have no env dependency and can be imported directly.

### Modules That Need env Mocking

| Module | Needs `env` mock? | Why |
|---|---|---|
| `src/lib/stripe.ts` | Yes | Creates `new Stripe(env.STRIPE_SECRET_KEY)` at module level |
| `src/lib/rate-limit.ts` | Yes | Reads `env.UPSTASH_REDIS_REST_URL` at module level |
| `src/lib/payments.ts` | No | Imports `payments.config.ts`, not env |
| `src/lib/validation.ts` | No | Pure Zod schemas, no env |
| `src/lib/utils.ts` | No | Pure function (`cn()`) |
| `src/config/pricing.ts` | No | Static config, no env |
| `src/actions/checkout.ts` | Yes | Imports from `stripe.ts` and `rate-limit.ts` |

### Testing Zod Schemas

Use `.safeParse()` and check the `success` boolean — never use `.parse()` in tests:

```ts
it("accepts valid input", () => {
  const result = mySchema.safeParse({ field: "value" })
  expect(result.success).toBe(true)
})

it("rejects invalid input", () => {
  const result = mySchema.safeParse({ field: "" })
  expect(result.success).toBe(false)
})
```

### Testing Pricing Functions

Use fixture plans instead of importing the real `plans` array (real plans have placeholder price IDs that may change):

```ts
const oneTimePlan: OneTimePlan = {
  type: "one-time",
  id: "test",
  name: "Test",
  description: "Test plan",
  priceId: "price_test",
  price: 29,
  currency: "usd",
  features: [{ text: "Feature", included: true }],
}

const recurringPlan: RecurringPlan = {
  type: "recurring",
  id: "test",
  name: "Test",
  description: "Test plan",
  monthlyPriceId: "price_monthly",
  yearlyPriceId: "price_yearly",
  monthlyPrice: 29,
  yearlyPrice: 290,
  currency: "usd",
  features: [{ text: "Feature", included: true }],
}
```

### TypeScript Strictness in Tests

This project has strict TypeScript (`noUncheckedIndexedAccess`, no `any`). ESLint relaxes some rules for test files (see `eslint.config.mjs`):

- `@typescript-eslint/consistent-type-assertions` — **off** (you can use `as` in tests)
- `@typescript-eslint/no-unsafe-*` — **off** (for mock objects and dynamic imports)
- `no-console` — **off**

But these are still enforced:
- `@typescript-eslint/consistent-type-imports` — use `import type` for type-only imports
- `import-x/order` — maintain proper import ordering

### Stripe Type Assertions in Tests

When you need a minimal Stripe object in a test, cast through `unknown`:

```ts
const customer = { id: "cus_abc123", object: "customer" }
expect(
  getCustomerId(customer as unknown as Parameters<typeof getCustomerId>[0])
).toBe("cus_abc123")
```

### E2E Tests (Playwright)

**Config: `playwright.config.ts`**

- Test directory: `e2e/`
- Base URL: `http://localhost:3000`
- Browser: Chromium only
- Web server: auto-starts `bun run dev` (reuses if already running)
- Timeout: 30s per test
- Retries: 0 locally, 2 in CI
- Screenshots: only on failure
- Traces: on first retry

**Writing an E2E test:**

```ts
import { test, expect } from "@playwright/test"

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-route")
  })

  test("renders the expected content", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /expected heading/i })
    ).toBeVisible()
  })
})
```

**E2E Selectors — prefer accessibility queries:**

1. `page.getByRole("heading", { name: /text/i })` — headings
2. `page.getByRole("button", { name: /text/i })` — buttons
3. `page.getByRole("link", { name: /text/i })` — links
4. `page.getByText(/text/i)` — visible text
5. `page.locator("[data-slot='card']")` — shadcn/ui components (they use `data-slot`)

Never use CSS class selectors or `data-testid` unless absolutely necessary.

**What you can and cannot test in E2E:**

Can test: page renders, navigation, button loading states, error/fallback UI, 404, heading hierarchy.

Cannot test (requires real Stripe keys): completing a payment, webhook processing, Customer Portal redirect, success page with a valid `session_id`.

### Existing Test Inventory

**Unit Tests (70 tests):**

| File | Tests | What it covers |
|---|---|---|
| `src/lib/validation.test.ts` | 27 | All Zod schemas: session IDs, customer IDs, price IDs, checkout input, portal input (incl. open redirect prevention), success page params |
| `src/config/pricing.test.ts` | 16 | `formatPrice` (USD, EUR, decimals, zero, large), `getPriceId`, `getDisplayPrice`, `getYearlySavings` (savings calc, no savings, free plan, 50% off) |
| `src/lib/stripe.test.ts` | 13 | `getCustomerId` (string, object, null, undefined, empty), `getResourceId` (same), `getStripeRedirectUrl` (fallback, paths, query params) — requires env mock |
| `src/lib/payments.test.ts` | 7 | `isEventRelevant` per payment mode (depends on `payments.config.ts` — currently `"subscription"`) |
| `src/lib/utils.test.ts` | 7 | `cn()` merging, falsy values, Tailwind conflicts, undefined/null, empty args, complex conflicts, array syntax |

**E2E Tests (5 specs):**

| File | What it covers |
|---|---|
| `e2e/pricing.spec.ts` | Pricing page heading, plan cards, plan names, features, CTA buttons, single h1 |
| `e2e/checkout-flow.spec.ts` | Button loading state on click, error handling for invalid price IDs |
| `e2e/success-page.spec.ts` | Invalid session fallback (no session_id, malformed, fake valid), back to home link |
| `e2e/cancel-page.spec.ts` | Cancel heading, "no payment" reassurance, Safe badge, pricing link, home link, navigation |
| `e2e/not-found.spec.ts` | Custom 404 status code, heading, home link, pricing link |

### When to Write Tests

- **New utility in `src/lib/` or `src/config/`**: Unit test next to it. Cover valid input, invalid input, edge cases.
- **New Zod schema**: Add to `validation.test.ts`. Test each rule, always test open redirect vectors on paths/URLs.
- **Implementing a webhook handler**: Unit test with env mock. Mock Stripe SDK calls.
- **New page/route**: E2E spec in `e2e/`. Test heading, content, navigation, invalid/missing params.
- **New component with logic**: `.test.tsx` next to it with `@testing-library/react`. Pure visual components → E2E instead.

### CI Considerations

- Set `CI=true` for Playwright (enables retries, single worker, github reporter)
- Unit tests need no env vars (mocked) — just `bun run test`
- E2E tests need real Stripe test keys in `.env.local` for checkout flow to fully pass
- Set `SKIP_ENV_VALIDATION=1` to build without Stripe keys (Docker builds)

### Common Pitfalls

1. **Importing a module that touches `env` without mocking** → Test crashes with "Missing environment variable". Solution: add `vi.mock("@/lib/env", ...)` before any import.

2. **ESLint errors on dynamic imports in tests** → Add `// eslint-disable-next-line @typescript-eslint/consistent-type-imports` above the `typeof import()` line.

3. **`payments.test.ts` results depend on config** → `isEventRelevant()` reads from `payments.config.ts`. If you change the mode, update expected results.

4. **Playwright can't find elements** → shadcn/ui uses `data-slot` attributes, not `data-testid`. Use `page.locator("[data-slot='card']")` for component containers.

5. **`noUncheckedIndexedAccess` in tests** → Array access like `items[0]` returns `T | undefined`. Use `items[0]!` or optional chaining in tests.

6. **Using `as` type assertions in source code** → ESLint bans `as` assertions everywhere except test files and the webhook route. Use type guards or helpers like `getCustomerId()` instead.

7. **Creating an API route for checkout** → Use Server Actions. The webhook handler is the ONLY API route.

8. **Importing `stripe` (server SDK) in a `'use client'` component** → Build will fail. Use `stripe-client.ts` for browser-side Stripe.js.

9. **Adding `console.log`** → ESLint warns. Use `console.warn` or `console.error` if you must, or remove the log.

10. **Modifying `src/components/ui/*`** → These are generated by shadcn/ui. Extend by wrapping, never edit directly.
