import type { Metadata } from "next"
import Link from "next/link"
import { FileQuestion, ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
}

/**
 * Custom 404 page.
 *
 * Shown when a user navigates to a route that doesn't exist.
 * Guides them back to the home page or pricing.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-7 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Page Not Found</CardTitle>
          <CardDescription className="text-balance">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Check the URL or navigate back to a known page.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back to Home
            </Link>
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
