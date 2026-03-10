"use client"

import { useState, useTransition } from "react"
import { ExternalLink, AlertCircle } from "lucide-react"

import { createPortalSession } from "@/actions/checkout"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface CustomerPortalButtonProps {
  /** Stripe Customer ID (cus_xxx). */
  customerId: string
  /** Button label. Defaults to "Manage Billing". */
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  /** Path to redirect to after the portal session. Defaults to "/". */
  returnPath?: string
}

/**
 * Opens the Stripe Customer Portal for managing subscriptions and billing.
 *
 * Flow:
 * 1. Calls the `createPortalSession` Server Action with the customer ID
 * 2. Receives the portal URL from the server
 * 3. Redirects the customer to the Stripe-hosted Billing Portal
 *
 * Displays inline error messages (e.g. rate limit exceeded)
 * below the button when the server action fails.
 *
 * Prerequisites:
 * - Configure the portal at https://dashboard.stripe.com/settings/billing/portal
 * - `customerPortal.enabled` must be `true` in `payments.config.ts`
 * - Pass a valid Stripe Customer ID (obtained after initial checkout)
 */
export function CustomerPortalButton({
  customerId,
  children = "Manage Billing",
  className,
  variant = "outline",
  size = "default",
  returnPath,
}: CustomerPortalButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await createPortalSession(customerId, returnPath)

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
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            Loading...
          </>
        ) : (
          <>
            {children}
            <ExternalLink data-icon="inline-end" />
          </>
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
