import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import { env } from "@/lib/env"

/**
 * Upstash Redis client for rate limiting.
 *
 * Uses REST-based Redis (no persistent connections), which is ideal
 * for serverless environments like Vercel.
 *
 * Returns `null` when Upstash credentials are not configured,
 * allowing the app to run without rate limiting in development.
 */
function createRedisClient(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }

  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = createRedisClient()

/**
 * Rate limiter for checkout session creation.
 *
 * Uses a sliding window algorithm:
 * - 10 requests per 60 seconds per identifier (IP address)
 *
 * This prevents abuse while allowing legitimate users to retry
 * if something goes wrong during checkout.
 *
 * Returns `null` when Upstash is not configured (development mode).
 */
export const checkoutRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "ratelimit:checkout",
    })
  : null

/**
 * Rate limiter for portal session creation.
 *
 * More lenient than checkout (20 requests per 60 seconds)
 * since portal access is less sensitive.
 */
export const portalRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "60 s"),
      prefix: "ratelimit:portal",
    })
  : null

/**
 * Checks rate limit for a given identifier.
 *
 * @param limiter - The rate limiter instance (or null if not configured)
 * @param identifier - Unique identifier for the client (typically IP address)
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfter }` in seconds
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: true } | { allowed: false; retryAfter: number }> {
  if (!limiter) {
    return { allowed: true }
  }

  const result = await limiter.limit(identifier)

  if (result.success) {
    return { allowed: true }
  }

  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
  return { allowed: false, retryAfter: Math.max(retryAfter, 1) }
}
