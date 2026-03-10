import type { Metadata } from "next"
import Link from "next/link"
import {
  CircleCheck,
  Mail,
  ArrowLeft,
  CreditCard,
  CalendarClock,
  Package,
  Receipt,
} from "lucide-react"

import { stripe } from "@/lib/stripe"
import { successPageParamsSchema } from "@/lib/validation"
import { formatPrice } from "@/config/pricing"
import { CustomerPortalButton } from "@/components/checkout/CustomerPortalButton"
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
  title: "Payment Successful",
  description: "Your payment has been processed successfully.",
}

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

/**
 * Post-checkout success page.
 *
 * Stripe redirects here after a successful payment with `?session_id=cs_xxx`.
 * We retrieve the full session server-side (with line_items expanded)
 * to display a detailed order confirmation.
 *
 * Handles both one-time payments and subscriptions.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const rawParams = await searchParams
  const parsed = successPageParamsSchema.safeParse(rawParams)

  if (!parsed.success) {
    return <InvalidSessionView />
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(parsed.data.session_id, {
      expand: ["line_items.data.price", "subscription", "payment_intent"],
    })
  } catch {
    return <InvalidSessionView />
  }

  if (session.status !== "complete") {
    return <InvalidSessionView />
  }

  const customerId = typeof session.customer === "string"
    ? session.customer
    : session.customer?.id ?? null
  const customerEmail = session.customer_details?.email
  const customerName = session.customer_details?.name
  const isSubscription = session.mode === "subscription"
  const lineItems = session.line_items?.data ?? []
  const amountTotal = session.amount_total
  const currency = session.currency ?? "usd"

  const subscription =
    isSubscription && typeof session.subscription === "object"
      ? session.subscription
      : null

  const billingInterval = subscription?.items.data[0]?.price.recurring
    ?.interval ?? null

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <Card className="w-full max-w-lg">
        {/* Header */}
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CircleCheck className="size-7 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>
            {customerName
              ? `Thank you, ${customerName}!`
              : "Thank you for your purchase!"}{" "}
            Your {isSubscription ? "subscription" : "order"} has been confirmed.
          </CardDescription>
        </CardHeader>

        <Separator />

        {/* Order details */}
        <CardContent className="space-y-4 pt-4">
          {/* Line items */}
          {lineItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Package className="size-4 text-muted-foreground" />
                Order Summary
              </div>
              <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {item.description}
                      </p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {formatPrice(item.amount_total / 100, item.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          {amountTotal !== null && (
            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <span className="text-lg font-bold">
                {formatPrice(amountTotal / 100, currency)}
              </span>
            </div>
          )}

          {/* Payment type badge */}
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Payment type</span>
            <Badge variant="secondary" className="ml-auto">
              {isSubscription ? "Subscription" : "One-time payment"}
            </Badge>
          </div>

          {/* Billing interval (subscriptions only) */}
          {billingInterval && (
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Billing cycle
              </span>
              <span className="ml-auto text-sm font-medium capitalize">
                {billingInterval}
              </span>
            </div>
          )}

          {/* Confirmation email */}
          {customerEmail && (
            <>
              <Separator />
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Confirmation sent to
                  </p>
                  <p className="truncate text-sm font-medium">
                    {customerEmail}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back to Home
            </Link>
          </Button>
          {isSubscription && customerId && (
            <CustomerPortalButton
              customerId={customerId}
              variant="outline"
              className="w-full sm:w-auto"
              returnPath="/checkout/success"
            >
              Manage Subscription
            </CustomerPortalButton>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}

/**
 * Fallback view for invalid or missing session IDs.
 */
function InvalidSessionView() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <CreditCard className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Invalid Session</CardTitle>
          <CardDescription>
            No valid checkout session was found. This link may have expired
            or already been used. If you believe this is an error, please
            contact support.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
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
