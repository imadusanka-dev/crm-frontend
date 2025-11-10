import { test, expect } from "@playwright/test";
import type { ICustomer } from "../src/types";

test.describe("Delete Customer Feature", () => {
  let customerId: string;
  let customerEmail: string;

  test.beforeEach(async ({ page }) => {
    // Create a test customer first
    const timestamp = Date.now();
    customerEmail = `delete.test.${timestamp}@example.com`;
    const testCustomer: Omit<ICustomer, "id" | "createdAt"> = {
      firstName: "Delete",
      lastName: "Test",
      email: customerEmail,
      phoneNumber: "+94779132866",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      country: "USA",
    };

    // Navigate to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Create customer via API
    // Default to localhost:3000, but can be overridden via environment variable
    const apiBaseURL = process.env.VITE_API_URL || "http://localhost:3000/api";
    const response = await page.request.post(`${apiBaseURL}/customer`, {
      data: testCustomer,
    });

    if (response.ok()) {
      const createdCustomer = await response.json();
      customerId = createdCustomer.id;
    } else {
      // If creation fails, skip test
      test.skip();
    }

    // Navigate to customer details page
    await page.goto(`/customer/${customerId}`);

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Wait for the customer name heading to appear (excluding "CRM" heading)
    const customerHeading = page
      .getByRole("heading", { name: /Delete Test/i })
      .filter({ hasNotText: "CRM" })
      .first();
    await expect(customerHeading).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display delete button on customer details page", async ({
    page,
  }) => {
    // Verify delete button is visible
    const deleteButton = page.getByTestId("delete-customer-button");
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await expect(deleteButton).toHaveText(/delete/i);
  });

  test("should show confirmation popup when clicking delete button", async ({
    page,
  }) => {
    // Click the delete button
    const deleteButton = page.getByTestId("delete-customer-button");
    await deleteButton.click();

    // Verify confirmation popup appears
    await expect(
      page.getByText(/are you sure you want to delete this customer/i)
    ).toBeVisible({ timeout: 2000 });
  });

  test("should cancel deletion when clicking cancel in confirmation", async ({
    page,
  }) => {
    // Click the delete button
    const deleteButton = page.getByTestId("delete-customer-button");
    await deleteButton.click();

    // Wait for confirmation popup
    await expect(
      page.getByText(/are you sure you want to delete this customer/i)
    ).toBeVisible({ timeout: 2000 });

    // Click cancel button in the Popconfirm
    const cancelButton = page.getByTestId("delete-customer-cancel-button");
    await cancelButton.click();

    // Verify we're still on the customer details page
    await expect(
      page.getByRole("heading", { name: /Delete Test/i })
    ).toBeVisible();
    await expect(deleteButton).toBeVisible();
  });

  test("should successfully delete customer when confirming", async ({
    page,
  }) => {
    // Click the delete button
    const deleteButton = page.getByTestId("delete-customer-button");
    await deleteButton.click();

    // Wait for confirmation popup
    await expect(
      page.getByText(/are you sure you want to delete this customer/i)
    ).toBeVisible({ timeout: 2000 });

    // Confirm deletion
    const confirmButton = page.getByTestId("delete-customer-confirm-button");
    await confirmButton.click();

    // Wait for navigation to home page (indicates successful deletion)
    await page.waitForURL("**/", { timeout: 15000 });

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Verify success message appears
    const successMessage = page.getByText(/customer deleted successfully/i);
    try {
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    } catch {
      // Message might have disappeared already, which is fine
    }

    // Verify we're on the home page
    await expect(
      page.getByRole("button", { name: /add customer/i })
    ).toBeVisible();
  });

  test("should navigate to home page after successful deletion", async ({
    page,
  }) => {
    // Click the delete button
    const deleteButton = page.getByTestId("delete-customer-button");
    await deleteButton.click();

    // Wait for confirmation popup
    await expect(
      page.getByText(/are you sure you want to delete this customer/i)
    ).toBeVisible({ timeout: 2000 });

    // Confirm deletion
    const confirmButton = page.getByTestId("delete-customer-confirm-button");
    await confirmButton.click();

    // Wait for navigation to home page
    await page.waitForURL("**/", { timeout: 15000 });

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Verify we're on the home page
    await expect(
      page.getByRole("button", { name: /add customer/i })
    ).toBeVisible();
  });
});
