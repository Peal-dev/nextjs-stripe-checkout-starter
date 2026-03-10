<p align="center">
  <img src="public/git.png" alt="Stripe Checkout Starter" width="100%" />
</p>

<h1 align="center">Next.js Stripe Checkout Starter</h1>

<p align="center">
  A production-ready Next.js 16 template for accepting payments with Stripe.<br />
  One-time purchases, subscriptions, or both — configured in a single file.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Stripe-SDK%20v20-635bff?logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Components-000?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/ESLint-Zero%20warnings-4b32c3?logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Vitest-70%20tests-6e9f18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Playwright-E2E-2ead33?logo=playwright&logoColor=white" alt="Playwright" />
</p>

---

## Features

| | Feature | Description |
|---|---|---|
| **Payment Modes** | | |
| :credit_card: | One-time payments | Single-charge checkout with Stripe hosted page |
| :repeat: | Subscriptions | Recurring billing with monthly/yearly toggle |
| :zap: | Hybrid mode | Both one-time and subscriptions in the same app |
| :gear: | Single config file | Switch payment modes in `payments.config.ts` |
| **Checkout Flow** | | |
| :sparkles: | Animated pricing cards | Smooth price transitions with NumberFlow |
| :white_check_mark: | Success page | Order confirmation with line items, total, email |
| :x: | Cancel page | Reassurance UI with "no charges made" messaging |
| :bust_in_silhouette: | Customer Portal | Self-service billing management via Stripe |
| **Security** | | |
| :lock: | Webhook signature verification | HMAC-verified Stripe webhook handler |
| :shield: | CSP + HSTS headers | Content-Security-Policy with Stripe domains whitelisted |
| :no_entry: | Rate limiting | Upstash Redis sliding window on checkout creation |
| :mag: | Zod validation | Every external input validated at the boundary |
| :key: | Type-safe env vars | Build-time validation via @t3-oss/env-nextjs |
| **DX** | | |
| :brain: | TypeScript strict mode | Zero `any`, zero errors, `noUncheckedIndexedAccess` |
| :broom: | ESLint strict config | `strictTypeChecked` + zero warnings |
| :jigsaw: | shadcn/ui components | Beautiful, accessible UI primitives |
| :bone: | Skeleton loading states | Instant perceived performance on every page |
| :rotating_light: | Error boundaries | Graceful error handling per route segment |
| :test_tube: | 70 unit tests | Vitest suites for validation, pricing, Stripe helpers |
| :performing_arts: | E2E test suite | Playwright tests for full checkout flow |

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) (strict mode) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Payments | [Stripe](https://stripe.com) (SDK v20 + Stripe.js v8) |
| Validation | [Zod](https://zod.dev) |
| Env Validation | [@t3-oss/env-nextjs](https://env.t3.gg) |
| Rate Limiting | [Upstash Redis](https://upstash.com) (optional) |
| Animations | [@number-flow/react](https://number-flow.barvian.me) |
| Linting | [ESLint 9](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) |
| Unit Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| E2E Testing | [Playwright](https://playwright.dev) |

<p align="center">
  <a href="https://github.com/Peal-dev/nextjs-stripe-checkout-starter">
    <img src="public/peal-star-us.png" alt="Star us on GitHub" width="100%" />
  </a>
</p>

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 18.17+ (or [Bun](https://bun.sh))
- [Stripe account](https://dashboard.stripe.com/register) (free to create)
- [Stripe CLI](https://docs.stripe.com/stripe-cli) (for local webhook testing)

### 1. Clone and install

```bash
git clone https://github.com/Peal-dev/nextjs-stripe-checkout-starter.git
cd nextjs-stripe-checkout-starter
bun install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Stripe keys:

```env
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Generated when you start the Stripe CLI listener (step 4)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Configure your pricing

Edit `src/config/pricing.ts` and replace the placeholder price IDs with your actual [Stripe Price IDs](https://dashboard.stripe.com/prices):

```ts
{
  type: "recurring",
  id: "pro",
  name: "Pro",
  monthlyPriceId: "price_YOUR_MONTHLY_ID",
  yearlyPriceId: "price_YOUR_YEARLY_ID",
  monthlyPrice: 29,
  yearlyPrice: 290,
  // ...
}
```

### 4. Start the webhook listener

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (`whsec_...`) it outputs into your `.env.local`.

### 5. Run the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) — you're ready to accept payments.

## Architecture

### Folder Structure

```
src/
├── app/
│   ├── (marketing)/              # Landing page, pricing
│   │   ├── pricing/
│   │   │   ├── page.tsx          # Pricing page
│   │   │   └── loading.tsx       # Skeleton UI
│   │   └── error.tsx             # Error boundary
│   ├── api/webhooks/stripe/
│   │   └── route.ts              # Webhook handler (ONLY API route)
│   ├── checkout/
│   │   ├── success/
│   │   │   ├── page.tsx          # Order confirmation
│   │   │   └── loading.tsx       # Skeleton UI
│   │   ├── cancel/page.tsx       # Cancellation page
│   │   └── error.tsx             # Error boundary
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading fallback
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx             # Custom 404
├── actions/
│   └── checkout.ts               # Server Actions (create checkout/portal sessions)
├── components/
│   ├── checkout/
│   │   ├── CheckoutButton.tsx    # Triggers Stripe Checkout redirect
│   │   └── CustomerPortalButton.tsx  # Opens Stripe Billing Portal
│   ├── pricing/
│   │   ├── PricingCard.tsx       # Plan card with animated prices
│   │   ├── PricingTable.tsx      # Orchestrator (adapts to payment mode)
│   │   └── PricingToggle.tsx     # Monthly/yearly billing switch
│   └── ui/                      # shadcn/ui primitives (do not modify)
├── config/
│   └── pricing.ts                # Plans, prices, features, price IDs
├── hooks/
│   ├── use-payments-config.ts    # Payment mode flags for conditional rendering
│   └── use-pricing.ts            # Billing interval toggle state
├── lib/
│   ├── env.ts                    # Type-safe env validation (@t3-oss/env-nextjs)
│   ├── stripe.ts                 # Stripe server client + helpers
│   ├── stripe-client.ts          # Stripe.js browser client (lazy-loaded)
│   ├── stripe-events/            # Webhook event handlers
│   │   ├── on-checkout-session-completed.ts
│   │   ├── on-invoice-paid.ts
│   │   ├── on-subscription-updated.ts
│   │   ├── on-subscription-deleted.ts
│   │   └── index.ts              # Barrel export
│   ├── payments.ts               # Payment mode logic + event filtering
│   ├── rate-limit.ts             # Upstash Redis rate limiter
│   ├── validation.ts             # Centralized Zod schemas
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── types/
│   ├── payments.ts               # PaymentMode, PaymentsConfig types
│   └── stripe.ts                 # CheckoutResult, PortalResult types
payments.config.ts                # Payment mode config (root)
```

### How It Works

```
User clicks "Subscribe"
        │
        ▼
  CheckoutButton (client)
        │ calls Server Action
        ▼
  createCheckoutSession (server)
        │ rate limit check → Zod validation → plan allowlist
        ▼
  Stripe Checkout (hosted)
        │ customer completes payment
        ▼
  ┌─────┴─────┐
  ▼           ▼
Success     Webhook
  Page      POST /api/webhooks/stripe
  │           │ signature verification
  │           ▼
  │         routeEvent()
  │           ├── onCheckoutSessionCompleted
  │           ├── onInvoicePaid
  │           ├── onSubscriptionUpdated
  │           └── onSubscriptionDeleted
  │
  ▼
Customer Portal (optional)
```

### Payment Modes

The entire payment behavior is controlled by a **single file** in the project root: `payments.config.ts`.

```ts
// payments.config.ts
import type { PaymentsConfig } from "@/types/payments";

const config: PaymentsConfig = {
  mode: "subscription",
  customerPortal: {
    enabled: true,
  },
  redirects: {
    success: "/checkout/success",
    cancel: "/checkout/cancel",
  },
};

export default config;
```

#### `mode`

Determines which Stripe flows are active across the entire app:

| Mode | Description | Webhook events processed | UI |
|---|---|---|---|
| `"one-time"` | Single-charge checkout only | `checkout.session.completed` | Pricing cards without billing toggle |
| `"subscription"` | Recurring billing only | `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted` | Pricing cards with monthly/yearly toggle |
| `"hybrid"` | Both flows simultaneously | All of the above | Mixed pricing cards with toggle |

Changing `mode` automatically adjusts:
- **Webhook processing** — irrelevant events are ignored (e.g., `invoice.paid` is skipped in `"one-time"` mode)
- **UI components** — the billing toggle only renders when subscriptions are supported
- **Checkout session params** — `mode: "payment"` vs `mode: "subscription"` is set automatically
- **Pricing cards** — plans with `type: "one-time"` or `type: "recurring"` are filtered based on the active mode

#### `customerPortal`

Controls whether the "Manage Billing" button is shown in the UI. When enabled, customers can access the [Stripe Customer Portal](https://dashboard.stripe.com/settings/billing/portal) to update payment methods, view invoices, and cancel subscriptions. Only relevant for `"subscription"` and `"hybrid"` modes.

#### `redirects`

Relative paths appended to `NEXT_PUBLIC_APP_URL` (falls back to `http://localhost:3000` in dev). These are passed to Stripe when creating checkout sessions:

- `success` — where the customer lands after a successful payment
- `cancel` — where the customer lands if they close the Stripe checkout page

#### How the config flows through the app

```
payments.config.ts (single source of truth)
        │
        ├── usePaymentsConfig() hook
        │     Returns config + derived flags:
        │     • supportsOneTime    (true for "one-time" | "hybrid")
        │     • supportsSubscriptions (true for "subscription" | "hybrid")
        │     Used by PricingTable, CustomerPortalButton, etc.
        │
        ├── createCheckoutSession() server action
        │     Reads mode to set Stripe checkout session type
        │
        ├── isEventRelevant() in lib/payments.ts
        │     Filters webhook events based on mode
        │
        └── routeEvent() in webhook handler
              Only processes events that pass isEventRelevant()
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peal-dev/nextjs-stripe-checkout-starter&env=STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=Stripe%20API%20keys%20required%20for%20the%20checkout%20flow&envLink=https://dashboard.stripe.com/apikeys)

1. Click the button above
2. Add your environment variables when prompted
3. After deployment, create a webhook in [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the webhook signing secret to your Vercel env vars
5. Set `NEXT_PUBLIC_APP_URL` to your production domain

### Manual Deployment

Works with any platform that supports Node.js 18+:

```bash
# Build
bun run build

# Start
bun run start
```

**Required environment variables for production:**

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_live_...`) |
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://example.com`) |

**Optional:**

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |

### Production Checklist

- [ ] Switch Stripe keys from `sk_test_` / `pk_test_` to `sk_live_` / `pk_live_`
- [ ] Create a production webhook endpoint in Stripe Dashboard
- [ ] Replace placeholder price IDs in `src/config/pricing.ts`
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Configure the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) in Stripe
- [ ] (Optional) Set up Upstash Redis for rate limiting
- [ ] Test a real payment in Stripe test mode before going live

## Screenshots

<!-- Add your screenshots here -->
<!-- ![Pricing Page](public/screenshots/pricing.png) -->
<!-- ![Checkout Success](public/screenshots/success.png) -->
<!-- ![Customer Portal](public/screenshots/portal.png) -->

*Screenshots coming soon — or add your own after customizing the template.*

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run unit tests (Vitest) |
| `bun run test:watch` | Run unit tests in watch mode |
| `bun run test:coverage` | Run unit tests with coverage report |
| `bun run test:e2e` | Run E2E tests (Playwright) |
| `bun run test:e2e:ui` | Run E2E tests with Playwright UI |

## Testing

### Unit Tests (Vitest)

70 tests across 5 suites covering all utility functions, validation schemas, and business logic:

| Suite | Tests | What it covers |
|---|---|---|
| `src/lib/validation.test.ts` | 27 | All Zod schemas — checkout input, portal input, webhook payload, open redirect prevention |
| `src/config/pricing.test.ts` | 16 | `formatPrice`, `getPriceId`, `getDisplayPrice`, `getYearlySavings` |
| `src/lib/stripe.test.ts` | 13 | `getCustomerId`, `getResourceId`, `getStripeRedirectUrl` (with env mocking) |
| `src/lib/payments.test.ts` | 7 | `isEventRelevant` event filtering across all payment modes |
| `src/lib/utils.test.ts` | 7 | `cn()` class merging and Tailwind conflict resolution |

```bash
# Run all unit tests
bun run test

# Watch mode (re-runs on file changes)
bun run test:watch

# With coverage report
bun run test:coverage
```

### E2E Tests (Playwright)

5 spec files covering the full checkout flow:

| Spec | What it covers |
|---|---|
| `e2e/pricing.spec.ts` | Pricing page render, plan cards, features, CTA buttons, heading hierarchy |
| `e2e/checkout-flow.spec.ts` | Checkout button loading state, error handling |
| `e2e/success-page.spec.ts` | Invalid/missing session fallback, navigation links |
| `e2e/cancel-page.spec.ts` | Cancel page render, reassurance messaging, navigation |
| `e2e/not-found.spec.ts` | Custom 404 page, status code, navigation links |

```bash
# Run E2E tests (headless)
bun run test:e2e

# Run with Playwright UI (interactive)
bun run test:e2e:ui
```

> **Note:** E2E tests require the dev server to be running. Playwright is configured to start it automatically via `webServer` in `playwright.config.ts`.

## FAQ

<details>
<summary><strong>Can I use this without subscriptions?</strong></summary>

Yes. Set `mode: "one-time"` in `payments.config.ts` and configure your one-time plans in `src/config/pricing.ts`. The subscription UI and webhook handlers will be automatically disabled.
</details>

<details>
<summary><strong>Do I need a database?</strong></summary>

No. This template is intentionally database-free. It uses Stripe as the source of truth for all payment data. The webhook handlers (`src/lib/stripe-events/`) are stubs where you add your own persistence logic (database writes, API calls, etc.) when you're ready.
</details>

<details>
<summary><strong>How do I add authentication?</strong></summary>

This template doesn't include auth by design — it's a checkout-focused starter. You can add any auth solution (NextAuth.js, Clerk, Lucia, etc.) and connect it to the Stripe customer ID in the webhook handlers.
</details>

<details>
<summary><strong>Is rate limiting required?</strong></summary>

No. Rate limiting is optional and requires an [Upstash](https://upstash.com) account. Without the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars, the app runs normally without rate limiting. Stripe also has its own API rate limits as a secondary protection.
</details>

<details>
<summary><strong>Can I use pnpm / npm instead of bun?</strong></summary>

Yes. Replace `bun` with your preferred package manager. The template uses standard Next.js conventions and has no bun-specific code. Just delete `bun.lock` and run `pnpm install` or `npm install`.
</details>

<details>
<summary><strong>How do I test webhooks locally?</strong></summary>

Use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This forwards Stripe events to your local webhook handler and outputs a `whsec_...` signing secret for your `.env.local`.
</details>

<details>
<summary><strong>Why Server Actions instead of API routes?</strong></summary>

Server Actions are the recommended pattern in Next.js App Router for mutations. They provide automatic form handling, optimistic updates, and progressive enhancement. The only API route in this project is the webhook handler, which must be a POST endpoint for Stripe to call.
</details>

<details>
<summary><strong>How do I customize the UI?</strong></summary>

- **Pricing plans**: Edit `src/config/pricing.ts` (names, prices, features)
- **Payment mode**: Edit `payments.config.ts` (one-time, subscription, hybrid)
- **Colors/theme**: Edit `src/app/globals.css` (Tailwind CSS variables)
- **Components**: Extend components in `src/components/` (don't modify `ui/` directly)
</details>

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with Next.js, Stripe, and shadcn/ui.
</p>
