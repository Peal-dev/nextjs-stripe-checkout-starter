"use client"

import { useState, useTransition } from "react"
import { AlertCircle } from "lucide-react"

import { createCheckoutSession } from "@/actions/checkout"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface CheckoutButtonProps {
  priceId: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary"
}

/**
 * Client-side button that triggers a Stripe Checkout redirect.
 *
 * Flow:
 * 1. Calls the `createCheckoutSession` Server Action with the price ID
 * 2. Receives the hosted Checkout URL from the server
 * 3. Redirects the user to Stripe's hosted Checkout page
 *
 * Displays inline error messages (e.g. rate limit exceeded)
 * below the button when the server action fails.
 */
export function CheckoutButton({
  priceId,
  children,
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckoutSession(priceId)

      if (!result.success) {
        setError(result.error)
        return
      }

      window.location.href = result.url
    })
  }

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size="lg"
        className={className}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            Processing...
          </>
        ) : (
          children
        )}
      </Button>
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
