"use client"

import NumberFlow from "@number-flow/react"
import { Check, X } from "lucide-react"

import type { PricingPlan, BillingInterval } from "@/config/pricing"
import {
  formatPrice,
  getDisplayPrice,
  getPriceId,
  getYearlySavings,
} from "@/config/pricing"
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
import { CheckoutButton } from "@/components/checkout/CheckoutButton"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  plan: PricingPlan
  interval: BillingInterval
  className?: string
}

/**
 * Renders a single pricing plan card with animated price transitions.
 *
 * Handles both one-time and recurring plans:
 * - One-time: shows flat price, no interval label
 * - Recurring: shows price per month, animated via NumberFlow on interval toggle
 *
 * The highlighted plan gets a ring accent and a "Most Popular" badge.
 */
export function PricingCard({ plan, interval, className }: PricingCardProps) {
  const price = getDisplayPrice(plan, interval)
  const priceId = getPriceId(plan, interval)
  const savings = getYearlySavings(plan)
  const isHighlighted = plan.highlighted === true

  const displayAmount =
    plan.type === "recurring" && interval === "yearly"
      ? price / 12
      : price

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-visible",
        isHighlighted && "ring-2 ring-primary",
        className
      )}
    >
      {isHighlighted && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <NumberFlow
              value={displayAmount}
              format={{
                style: "currency",
                currency: plan.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              className="text-4xl font-bold tracking-tight"
            />
            {plan.type === "recurring" && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>

          {plan.type === "recurring" && interval === "yearly" && (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatPrice(price, plan.currency)} billed yearly
              {savings > 0 && (
                <Badge variant="secondary" className="ml-2">
                  Save {savings}%
                </Badge>
              )}
            </p>
          )}
        </div>

        <Separator className="mb-6" />

        <ul className="flex flex-1 flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-2.5">
              {feature.included ? (
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
              )}
              <span
                className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <CheckoutButton
          priceId={priceId}
          variant={isHighlighted ? "default" : "outline"}
          className="w-full"
        >
          {plan.type === "recurring" ? "Subscribe" : "Buy Now"}
        </CheckoutButton>
      </CardFooter>
    </Card>
  )
}
