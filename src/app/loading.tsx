import { Spinner } from "@/components/ui/spinner"

/**
 * Root loading state.
 *
 * Shown as a fallback while route segments are loading.
 * Uses a centered spinner for a clean, minimal loading experience.
 *
 * More specific loading states (e.g., checkout/success, pricing)
 * have their own skeleton UIs that override this one.
 */
export default function RootLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </main>
  )
}
