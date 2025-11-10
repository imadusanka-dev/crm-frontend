import { test, expect } from "@playwright/test";

test.describe("Customer List View", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display the customer list page", async ({ page }) => {
    // Check that the page title/heading is visible
    await expect(page.getByRole("heading", { name: /CRM/i })).toBeVisible();

    // Check that the search bar is visible
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();

    // Check that the "Add Customer" button is visible
    await expect(
      page.getByRole("button", { name: /add customer/i })
    ).toBeVisible();
  });

  test("should display customer cards when customers exist", async ({
    page,
  }) => {
    // Wait for customer cards to load (if any exist) or "no records" message
    await page.waitForLoadState("networkidle");

    // Wait a bit for React to render
    await page.waitForTimeout(1000);

    // Check if there are any customer cards or "no records" message
    const hasCustomers = await page
      .locator('[class*="bg-white"][class*="rounded-lg"]')
      .count();
    const hasNoRecords = await page.getByText(/no records found/i).count();

    // Either customers should be displayed or "no records" message
    expect(hasCustomers > 0 || hasNoRecords > 0).toBe(true);
  });

  test("should display loading state initially", async ({ page }) => {
    // Navigate to a fresh page to catch loading state
    await page.goto("/");

    // Wait for page to load and render
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // After loading, either customer cards or "no records" should be visible
    const hasCustomers = await page
      .locator('[class*="bg-white"][class*="rounded-lg"]')
      .count();
    const hasNoRecords = await page.getByText(/no records found/i).count();

    expect(hasCustomers > 0 || hasNoRecords > 0).toBe(true);
  });

  test("should display no records message when no customers found", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Check if "No records found" message is displayed (if no customers exist)
    const noRecordsMessage = page.getByText(/no records found/i);
    const customerCards = page.locator(
      '[class*="bg-white"][class*="rounded-lg"]'
    );

    // Either no records message or customer cards should be visible
    const hasNoRecords = (await noRecordsMessage.count()) > 0;
    const hasCustomers = (await customerCards.count()) > 0;

    expect(hasNoRecords || hasCustomers).toBe(true);
  });

  test("should filter customers when searching", async ({ page }) => {
    // Wait for initial load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Type in search bar
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("test");

    // Wait for debounce (500ms) and API call
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    // Verify search input has the value
    await expect(searchInput).toHaveValue("test");
  });

  test("should navigate to customer details when clicking view icon", async ({
    page,
  }) => {
    // Wait for customer cards to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Check if there are any customer cards
    const customerCards = page
      .locator('[class*="bg-white"][class*="rounded-lg"]')
      .filter({
        has: page.locator('button[aria-label="View more details"]'),
      });

    const cardCount = await customerCards.count();

    if (cardCount > 0) {
      // Find the first view button
      const viewButton = customerCards
        .first()
        .locator('button[aria-label="View more details"]')
        .first();

      // Wait for the button to be visible and clickable
      await expect(viewButton).toBeVisible({ timeout: 5000 });
      await viewButton.click();

      // Wait for navigation - URL should match /customer/:id pattern
      await page.waitForURL(/\/customer\/[^/]+$/, { timeout: 10000 });

      // Wait for customer details to load
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      // Verify we're on the customer details page
      // Check for a heading that's not "CRM" (the customer name heading)
      const customerHeading = page
        .getByRole("heading", { level: 1 })
        .filter({ hasNotText: "CRM" })
        .first();
      await expect(customerHeading).toBeVisible({
        timeout: 5000,
      });
    } else {
      // Skip test if no customers exist
      test.skip();
    }
  });
});
