import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ShieldCheck, RotateCcw } from "lucide-react"

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

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your checkout session was cancelled. No charges were made.",
}

/**
 * Post-checkout cancel page.
 *
 * Stripe redirects here when the customer clicks the back button
 * or closes the Checkout page without completing payment.
 *
 * Designed to reassure the customer and guide them back to pricing.
 */
export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
            <RotateCcw className="size-7 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Checkout Cancelled</CardTitle>
          <CardDescription className="text-balance">
            Your checkout session was cancelled and no charges were made.
            You can return to pricing and try again whenever you&apos;re ready.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <ShieldCheck className="size-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium">No payment processed</p>
              <p className="text-xs text-muted-foreground">
                Your payment method was not charged. All transactions
                are securely handled by Stripe.
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto shrink-0">
              Safe
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/pricing">
              View Pricing
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
