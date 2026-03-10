import { test, expect } from "@playwright/test"

/**
 * E2E tests for the checkout success page.
 *
 * Tests both the valid and invalid session states.
 * We can't test with a real Stripe session in E2E, but we verify
 * the invalid session fallback renders correctly.
 */

test.describe("Success Page", () => {
  test("shows invalid session view when no session_id is provided", async ({
    page,
  }) => {
    await page.goto("/checkout/success")

    await expect(
      page.getByRole("heading", { name: /invalid session/i })
    ).toBeVisible()
    await expect(
      page.getByText(/no valid checkout session was found/i)
    ).toBeVisible()
  })

  test("shows invalid session view for malformed session_id", async ({
    page,
  }) => {
    await page.goto("/checkout/success?session_id=invalid")

    await expect(
      page.getByRole("heading", { name: /invalid session/i })
    ).toBeVisible()
  })

  test("has a back to home link on invalid session", async ({ page }) => {
    await page.goto("/checkout/success")

    const homeLink = page.getByRole("link", { name: /back to home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute("href", "/")
  })

  test("shows invalid session for fake but correctly formatted session_id", async ({
    page,
  }) => {
    // This session ID has the right format but doesn't exist in Stripe
    await page.goto("/checkout/success?session_id=cs_test_fakeSessionId123")

    // Should show invalid session (Stripe API will reject it)
    await expect(
      page.getByRole("heading", { name: /invalid session/i })
    ).toBeVisible()
  })
})
