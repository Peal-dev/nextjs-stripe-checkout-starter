import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are never exposed to the client.
   */
  server: {
    STRIPE_SECRET_KEY: z
      .string()
      .startsWith("sk_", "Must be a valid Stripe secret key (sk_test_ or sk_live_)"),
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .startsWith("whsec_", "Must be a valid Stripe webhook signing secret"),
    STRIPE_CUSTOMER_PORTAL_URL: z.string().url().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  /**
   * Client-side environment variables schema.
   * Only variables prefixed with NEXT_PUBLIC_ are allowed.
   */
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
      .string()
      .startsWith("pk_", "Must be a valid Stripe publishable key (pk_test_ or pk_live_)"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  /**
   * Runtime values mapping.
   * Destructure all environment variables from process.env here.
   * @t3-oss/env-nextjs handles the build-time transform for client vars.
   */
  runtimeEnv: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_CUSTOMER_PORTAL_URL: process.env.STRIPE_CUSTOMER_PORTAL_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation in edge cases (e.g., Docker builds without env vars).
   * Set SKIP_ENV_VALIDATION=1 to bypass.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   * Prevents accidentally passing empty env vars.
   */
  emptyStringAsUndefined: true,
});
