import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/**
 * Loading skeleton for the checkout success page.
 *
 * Mirrors the layout of the real success page while the server
 * retrieves the Stripe Checkout Session (which can take 1-3s).
 *
 * Skeleton structure:
 * - Success icon + title + description
 * - Order summary block with line items
 * - Total row
 * - Payment type row
 * - Email confirmation block
 * - Action buttons
 */
export default function CheckoutSuccessLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <Card className="w-full max-w-lg">
        {/* Header skeleton */}
        <CardHeader className="items-center text-center">
          <Skeleton className="mb-2 size-14 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>

        <Separator />

        {/* Order details skeleton */}
        <CardContent className="space-y-4 pt-4">
          {/* Order summary label */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            {/* Line items */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Payment type */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-5 w-28 rounded-full" />
          </div>

          <Separator />

          {/* Email confirmation */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <Skeleton className="size-4 shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </CardContent>

        {/* Action buttons */}
        <CardFooter className="flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-44" />
        </CardFooter>
      </Card>
    </main>
  )
}
