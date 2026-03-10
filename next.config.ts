import type { NextConfig } from "next"

import "./src/lib/env"

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
}

export default nextConfig

// ---------------------------------------------------------------------------
// Security Headers
//
// References:
// - https://owasp.org/www-project-secure-headers/
// - https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// - https://docs.stripe.com/security/guide (Stripe CSP requirements)
// ---------------------------------------------------------------------------

/**
 * Content-Security-Policy directives.
 *
 * Stripe requires specific domains whitelisted for:
 * - Stripe.js (script, connect, frame)
 * - Hosted Checkout (script, connect, frame, img)
 * - 3D Secure / redirect payment methods (frame: hooks.stripe.com)
 * - Google Maps (used by Stripe Address Element)
 */
const cspDirectives = [
  // Fallback for directives not explicitly listed
  "default-src 'self'",

  // JavaScript sources
  [
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "https://js.stripe.com",
    "https://*.js.stripe.com",
    "https://checkout.stripe.com",
    "https://maps.googleapis.com",
  ].join(" "),

  // Stylesheets
  "style-src 'self' 'unsafe-inline'",

  // Images
  [
    "img-src 'self' data: blob:",
    "https://*.stripe.com",
  ].join(" "),

  // Fonts
  "font-src 'self' data:",

  // API / XHR / fetch connections
  [
    "connect-src 'self'",
    "https://api.stripe.com",
    "https://checkout.stripe.com",
    "https://maps.googleapis.com",
  ].join(" "),

  // Iframes
  [
    "frame-src 'self'",
    "https://js.stripe.com",
    "https://*.js.stripe.com",
    "https://hooks.stripe.com",
    "https://checkout.stripe.com",
  ].join(" "),

  // Workers (Next.js uses service workers in some configs)
  "worker-src 'self' blob:",

  // Forms can only submit to self
  "form-action 'self'",

  // Only allow iframing from same origin (clickjacking prevention)
  "frame-ancestors 'self'",

  // Base URI restriction (prevents base tag injection)
  "base-uri 'self'",

  // Block all <object>, <embed>, <applet> elements
  "object-src 'none'",
]

const ContentSecurityPolicy = cspDirectives.join("; ")

const securityHeaders = [
  // -------------------------------------------------------------------
  // Content-Security-Policy
  // Controls which resources the browser is allowed to load.
  // -------------------------------------------------------------------
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },

  // -------------------------------------------------------------------
  // Strict-Transport-Security (HSTS)
  // Forces HTTPS for 2 years, includes subdomains, allows preload list.
  // WARNING: Only enable preload if you're certain ALL subdomains support HTTPS.
  // -------------------------------------------------------------------
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // -------------------------------------------------------------------
  // X-Content-Type-Options
  // Prevents MIME type sniffing (IE/Chrome).
  // -------------------------------------------------------------------
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // -------------------------------------------------------------------
  // X-Frame-Options
  // Legacy clickjacking protection (CSP frame-ancestors is the modern way).
  // Kept for older browsers that don't support CSP.
  // -------------------------------------------------------------------
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  // -------------------------------------------------------------------
  // X-DNS-Prefetch-Control
  // Controls DNS prefetching. Enabled for performance (Stripe domains).
  // -------------------------------------------------------------------
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },

  // -------------------------------------------------------------------
  // Referrer-Policy
  // Controls how much referrer info is sent with requests.
  // strict-origin-when-cross-origin: sends origin on cross-origin,
  // full URL on same-origin.
  // -------------------------------------------------------------------
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // -------------------------------------------------------------------
  // Permissions-Policy
  // Controls which browser features the page can use.
  // Disables features not needed by a checkout app.
  // -------------------------------------------------------------------
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "browsing-topics=()",
    ].join(", "),
  },
]
