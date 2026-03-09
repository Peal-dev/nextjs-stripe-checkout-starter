# CLAUDE.md

## Project Overview
Stripe Checkout Starter — A production-ready Next.js 16 template for Stripe payments.
Built with: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Stripe.
No auth, no database — pure Stripe checkout integration.

## Architecture
- App Router with route groups: (marketing)
- Server Components by default, 'use client' only when needed
- Server Actions for creating checkout sessions (not API routes)
- API route ONLY for Stripe webhook handler
- No database, no auth — intentionally minimal

## Tech Stack (do not change without approval)
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui
- Stripe SDK (stripe + @stripe/stripe-js)
- @t3-oss/env-nextjs (type-safe env validation)
- Zod (runtime validation for forms and API input)
- Vitest + Playwright (testing)

## Folder Structure
src/
  app/
    (marketing)/          — landing page, pricing
    api/webhooks/stripe/route.ts — Stripe webhook handler (ONLY API route)
    checkout/success/page.tsx    — post-payment success page
    checkout/cancel/page.tsx     — post-payment cancel page
    layout.tsx
  components/
    ui/                   — shadcn/ui primitives (DO NOT modify directly)
    pricing/              — PricingCard, PricingToggle, PricingTable
    checkout/             — CheckoutButton, CustomerPortalButton
  config/
    pricing.ts            — pricing plans config (price IDs, features, metadata)
  lib/
    stripe.ts             — Stripe server-side client instance + helpers
    env.ts                — @t3-oss/env-nextjs config (server + client env)
    utils.ts              — cn() helper (clsx + tailwind-merge)
  actions/
    checkout.ts           — Server Actions: createCheckoutSession, createPortalSession
  hooks/
    use-pricing.ts        — Pricing toggle state hook
  types/
    stripe.ts             — Stripe-related TypeScript types

## Coding Standards
- TypeScript strict mode, no any, use unknown + type guards
- Zod for runtime validation on forms and API input
- @t3-oss/env-nextjs for type-safe environment variables (src/lib/env.ts)
- Export explicit types, do not rely on inference for public API
- Tailwind only (no CSS modules, no inline styles)
- Use cn() helper (clsx + tailwind-merge) for conditional classes
- shadcn/ui for base components — extend, don't reinvent
- Conventional commits: feat:, fix:, docs:, chore:

## File Naming
- Components: PascalCase (PricingCard.tsx, CheckoutButton.tsx)
- Utilities/hooks: camelCase (usePricing.ts, formatPrice.ts)
- Routes: kebab-case directories (app/checkout/success/page.tsx)
- Types: PascalCase, suffix with Props/State/Config as needed
- Config files: camelCase (pricing.ts)

## Component Patterns
- Props interface co-located with component file
- Prefer composition over prop drilling
- Extract hooks for logic > 10 lines
- Loading states via Suspense + loading.tsx with skeleton UI
- Error handling via error.tsx per route segment
- Server Components by default, 'use client' only for interactivity
- Server Actions for creating Stripe sessions (not API routes)

## Stripe Patterns
- Server-side Stripe client in src/lib/stripe.ts: new Stripe(env.STRIPE_SECRET_KEY)
- NEVER import Stripe server SDK in client components
- Checkout sessions created via Server Actions in src/actions/checkout.ts
- Webhook handler: src/app/api/webhooks/stripe/route.ts
- ALWAYS verify webhook signatures with stripe.webhooks.constructEvent()
- Pricing config in src/config/pricing.ts (price IDs, features list, metadata)
- Customer Portal sessions created server-side
- Use Stripe test mode for development (sk_test_, pk_test_)
- Handle these webhook events: checkout.session.completed, invoice.paid, customer.subscription.updated, customer.subscription.deleted

## Testing
- Vitest for unit/integration tests
- Playwright for E2E tests
- Test files next to source: Component.test.tsx
- Use Stripe CLI for webhook testing (stripe listen --forward-to)
- E2E must cover: pricing page render, checkout redirect, success page, cancel page

## Security Rules
- NEVER expose Stripe secret key in client code
- NEVER expose webhook signing secret in client code
- ALL user input validated with Zod before processing
- ALWAYS verify webhook signatures before processing events
- Rate limit checkout session creation
- Headers: CSP, HSTS in next.config.ts
- NEXT_PUBLIC_ prefix only for Stripe publishable key
- Env vars validated at startup via @t3-oss/env-nextjs (src/lib/env.ts)

## Performance Rules
- Dynamic imports for heavy components (next/dynamic)
- next/image for ALL images (with explicit dimensions)
- next/font for ALL fonts (display: swap)
- Prefer ISR/SSG over SSR (pricing page can be static)
- Keep First Load JS under 100KB
- Lighthouse score >= 95 on all categories
- No layout shift (CLS < 0.1)

## Environment Variables
- All env vars defined via @t3-oss/env-nextjs in src/lib/env.ts
- Use createEnv() with server and client schemas (Zod-based)
- Use .env.example as source of truth (every var documented with comments)
- Required server vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- Required client vars: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Optional server vars: STRIPE_CUSTOMER_PORTAL_URL
- Access env vars ONLY through the env object from src/lib/env.ts, never via process.env directly

## Git Workflow
- Branch naming: feature/*, fix/*, chore/*
- Squash merge to main
- No direct commits to main
- Husky + lint-staged for pre-commit hooks

## Scripts (package.json)
- pnpm dev — start dev server
- pnpm build — production build
- pnpm stripe:listen — start Stripe CLI webhook listener
- pnpm lint — ESLint check
- pnpm test — run Vitest
- pnpm test:e2e — run Playwright

## Do NOT
- Add console.log (use proper logger or remove)
- Use default exports (except for pages/layouts)
- Install packages without checking existing deps first
- Modify generated shadcn/ui components directly (extend instead)
- Use as type assertions (use type guards instead)
- Create API routes for checkout (use Server Actions)
- Skip webhook signature verification
- Hardcode Stripe price IDs in components (use config/pricing.ts)
- Import stripe server SDK in client components
- Skip Zod validation on any user input
- Hardcode secrets or config values
- Access process.env directly (use the env object from src/lib/env.ts)