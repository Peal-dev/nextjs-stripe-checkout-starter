import type { Metadata } from "next"

import { PricingTable } from "@/components/pricing/PricingTable"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Choose the plan that works for you.",
}

/**
 * Pricing page.
 *
 * Renders the full pricing table with plan cards and billing toggle.
 * The table adapts automatically based on the payment mode
 * configured in `payments.config.ts`.
 */
export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple, transparent pricing. Choose the plan that works for you.
        </p>
      </div>

      <PricingTable />
    </main>
  )
}
