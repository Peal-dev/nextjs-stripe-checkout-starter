"use client";

import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/checkout";

interface CheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlighted";
}

/**
 * Client-side button that triggers a Stripe Checkout redirect.
 *
 * Flow:
 * 1. Calls the `createCheckoutSession` Server Action with the price ID
 * 2. Receives the hosted Checkout URL from the server
 * 3. Redirects the user to Stripe's hosted Checkout page
 *
 * Uses React's `useTransition` for a non-blocking pending state
 * without manual loading state management.
 */
export function CheckoutButton({
  priceId,
  children,
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await createCheckoutSession(priceId);

      if (!result.success) {
        // TODO: Replace with your preferred error handling (toast, alert, etc.)
        return;
      }

      window.location.href = result.url;
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "highlighted"
          ? "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground"
          : "border border-foreground/20 bg-background text-foreground hover:bg-foreground/5 focus-visible:ring-foreground/50",
        className
      )}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
