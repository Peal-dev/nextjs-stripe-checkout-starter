import { test, expect } from "@playwright/test"

/**
 * E2E tests for the checkout cancel page.
 *
 * Verifies the cancel page renders correctly with reassurance messaging
 * and proper navigation links.
 */

test.describe("Cancel Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkout/cancel")
  })

  test("renders the cancel page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /checkout cancelled/i })
    ).toBeVisible()
  })

  test("shows reassurance that no payment was made", async ({ page }) => {
    await expect(page.getByText(/no payment processed/i)).toBeVisible()
  })

  test("shows the Safe badge", async ({ page }) => {
    await expect(page.getByText("Safe")).toBeVisible()
  })

  test("has a link to pricing page", async ({ page }) => {
    const pricingLink = page.getByRole("link", { name: /view pricing/i })
    await expect(pricingLink).toBeVisible()
    await expect(pricingLink).toHaveAttribute("href", "/pricing")
  })

  test("has a link to home page", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: /back to home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute("href", "/")
  })

  test("navigates to pricing when clicking View Pricing", async ({ page }) => {
    await page.getByRole("link", { name: /view pricing/i }).click()
    await expect(page).toHaveURL(/\/pricing/)
  })

  test("navigates to home when clicking Back to Home", async ({ page }) => {
    await page.getByRole("link", { name: /back to home/i }).click()
    await expect(page).toHaveURL("/")
  })
})
