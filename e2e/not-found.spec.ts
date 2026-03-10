import { test, expect } from "@playwright/test"

/**
 * E2E tests for the custom 404 page.
 *
 * Verifies that non-existent routes show the custom not-found page
 * with proper navigation links.
 */

test.describe("404 Page", () => {
  test("shows custom 404 for non-existent routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist")

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", { name: /page not found/i })
    ).toBeVisible()
  })

  test("has a back to home link", async ({ page }) => {
    await page.goto("/non-existent-page")

    const homeLink = page.getByRole("link", { name: /back to home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute("href", "/")
  })

  test("has a link to pricing", async ({ page }) => {
    await page.goto("/non-existent-page")

    const pricingLink = page.getByRole("link", { name: /view pricing/i })
    await expect(pricingLink).toBeVisible()
    await expect(pricingLink).toHaveAttribute("href", "/pricing")
  })
})
