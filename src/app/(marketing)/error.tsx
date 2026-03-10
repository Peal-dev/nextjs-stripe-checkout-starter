"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Error boundary for the (marketing) route group.
 *
 * Catches errors from pages like /pricing.
 * Since marketing pages are mostly static, errors here are rare
 * but could occur from config issues or SSR failures.
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Marketing page error:", error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Failed to Load Page</CardTitle>
          <CardDescription className="text-balance">
            We couldn&apos;t load this page. Please try again or return to the
            home page.
          </CardDescription>
          {error.digest && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </CardHeader>
        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RotateCcw data-icon="inline-start" />
            Try Again
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
