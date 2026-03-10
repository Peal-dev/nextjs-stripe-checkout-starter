"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Root error boundary.
 *
 * Catches unhandled errors across the entire application.
 * This is the last line of defense — more specific error boundaries
 * in nested route segments (e.g., /checkout, /(marketing)) will
 * catch errors before they bubble up here.
 *
 * Next.js requires error boundaries to be Client Components.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to your error reporting service (Sentry, etc.)
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription className="text-balance">
            An unexpected error occurred. Please try again or return to the home
            page. If the problem persists, contact support.
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
