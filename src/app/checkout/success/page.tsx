import type { Metadata } from "next";
import Link from "next/link";

import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment has been processed successfully.",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Post-checkout success page.
 *
 * Stripe redirects here after a successful payment with `?session_id=cs_xxx`.
 * We retrieve the session server-side to display confirmation details.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold">Invalid Session</h1>
          <p className="mt-2 text-foreground/60">
            No checkout session was found. If you believe this is an error,
            please contact support.
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

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const customerEmail = session.customer_details?.email;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold">Payment Successful</h1>

        <p className="mt-2 text-foreground/60">
          Thank you for your purchase!
          {customerEmail && (
            <>
              {" "}
              A confirmation has been sent to{" "}
              <span className="font-medium text-foreground">
                {customerEmail}
              </span>
              .
            </>
          )}
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
