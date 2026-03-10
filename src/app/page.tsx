import Link from "next/link"
import {
  CreditCard,
  Repeat,
  Zap,
  Shield,
  ArrowRight,
  FileCode2,
  Webhook,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: CreditCard,
    title: "One-Time Payments",
    description: "Single-charge checkout via Stripe hosted page.",
  },
  {
    icon: Repeat,
    title: "Subscriptions",
    description: "Recurring billing with monthly/yearly toggle.",
  },
  {
    icon: Zap,
    title: "Hybrid Mode",
    description: "Both one-time and subscriptions in the same app.",
  },
  {
    icon: FileCode2,
    title: "Single Config File",
    description: "Switch payment modes in payments.config.ts.",
  },
  {
    icon: Webhook,
    title: "Webhook Handler",
    description: "Signature-verified event processing with stubs ready to implement.",
  },
  {
    icon: Lock,
    title: "Production Security",
    description: "CSP headers, rate limiting, Zod validation, type-safe env.",
  },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6">
            Next.js 16 + Stripe + TypeScript
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Stripe Checkout
            <br />
            <span className="text-muted-foreground">Starter Template</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A production-ready Next.js template for accepting payments with Stripe.
            One-time purchases, subscriptions, or both — configured in a single file.
            No database, no auth, no boilerplate.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/pricing">
                View Pricing
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/Peal-dev/nextjs-stripe-checkout-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <section className="mx-auto mt-24 w-full max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            What&apos;s Included
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Get Started in 5 Minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clone the repo, add your Stripe keys, configure your plans, and you&apos;re
            accepting payments.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border bg-zinc-950 p-6 text-left">
            <code className="text-sm text-zinc-300">
              <span className="text-zinc-500">$</span> git clone https://github.com/Peal-dev/nextjs-stripe-checkout-starter.git
              <br />
              <span className="text-zinc-500">$</span> cd nextjs-stripe-checkout-starter
              <br />
              <span className="text-zinc-500">$</span> bun install
              <br />
              <span className="text-zinc-500">$</span> cp .env.example .env.local
              <br />
              <span className="text-zinc-500">$</span> bun dev
            </code>
          </div>

          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/pricing">
                See It in Action
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Built by{" "}
        <a
          href="https://peal.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Peal.dev
        </a>
        {" "}— Robert Seghedi &amp; Stefan Binisor
      </footer>
    </div>
  )
}
