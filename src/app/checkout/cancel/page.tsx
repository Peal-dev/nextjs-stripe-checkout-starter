import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your checkout session was cancelled.",
};

/**
 * Post-checkout cancel page.
 *
 * Stripe redirects here when the customer clicks the back button
 * or closes the Checkout page without completing payment.
 */
export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
          <svg
            className="h-8 w-8 text-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold">Payment Cancelled</h1>

        <p className="mt-2 text-foreground/60">
          Your checkout session was cancelled. No charges were made.
          You can try again whenever you&apos;re ready.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
