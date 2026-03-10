"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CreditCard, RotateCcw, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/**
 * Error boundary for the /checkout route segment.
 *
 * Catches errors from both /checkout/success and /checkout/cancel pages.
 * The most likely errors here are Stripe API failures when retrieving
 * the checkout session on the success page.
 *
 * Reassures the customer that no payment was lost, since Stripe has
 * already processed the payment before redirecting to the success page.
 */
export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Checkout error:", error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <CreditCard className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Checkout Error</CardTitle>
          <CardDescription className="text-balance">
            We couldn&apos;t load your checkout details. This is usually a
            temporary issue — your payment was not affected.
          </CardDescription>
          {error.digest && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <CreditCard className="size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium">Your payment is safe</p>
              <p className="text-xs text-muted-foreground">
                If you completed a payment, it was processed successfully
                by Stripe. You should receive a confirmation email shortly.
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto shrink-0">
              Safe
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RotateCcw data-icon="inline-start" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/pricing">
              View Pricing
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
