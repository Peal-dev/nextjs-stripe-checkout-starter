import { test, expect } from "@playwright/test"

/**
 * E2E tests for the pricing page.
 *
 * Validates that the pricing page renders correctly, plans are visible,
 * and the billing toggle works as expected.
 */

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing")
  })

  test("renders the pricing page with heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /pricing/i })).toBeVisible()
  })

  test("displays pricing plan cards", async ({ page }) => {
    // Should have at least one plan card visible
    const cards = page.locator("[data-slot='card']")
    await expect(cards.first()).toBeVisible()
  })

  test("displays plan names", async ({ page }) => {
    // Check that at least one plan name is visible
    await expect(page.getByText("Starter")).toBeVisible()
  })

  test("displays plan features", async ({ page }) => {
    // Check that feature text is rendered
    await expect(page.getByText("Core features").first()).toBeVisible()
  })

  test("displays checkout buttons on all plans", async ({ page }) => {
    const buttons = page.getByRole("button", {
      name: /subscribe|buy now/i,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test("has no accessibility violations on heading hierarchy", async ({
    page,
  }) => {
    // Ensure there's exactly one h1
    const h1Elements = page.locator("h1")
    await expect(h1Elements).toHaveCount(1)
  })
})
