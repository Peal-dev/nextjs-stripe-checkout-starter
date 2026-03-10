import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/**
 * Loading skeleton for the pricing page.
 *
 * Mirrors the layout of the PricingTable with 3 plan cards.
 * Shows the page heading, billing toggle, and card skeletons.
 */
export default function PricingLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-24">
      {/* Page heading */}
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="mt-4 h-5 w-80" />
      </div>

      {/* Billing toggle */}
      <div className="mb-10 flex items-center gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-10 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Plan cards */}
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <PricingCardSkeleton key={i} highlighted={i === 1} />
        ))}
      </div>
    </main>
  )
}

function PricingCardSkeleton({ highlighted }: { highlighted?: boolean }) {
  return (
    <Card
      className={
        highlighted ? "relative ring-2 ring-primary" : "relative"
      }
    >
      {highlighted && (
        <Skeleton className="absolute -top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full" />
      )}

      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-1 h-4 w-full" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* Price */}
        <div className="mb-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="mt-1 h-3 w-20" />
        </div>

        <Separator className="mb-6" />

        {/* Features */}
        <div className="flex flex-1 flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="size-4 shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
