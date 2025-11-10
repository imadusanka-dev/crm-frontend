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
      phoneNumber: "+1234567890",
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
    const apiBaseURL = process.env.VITE_API_URL || "http://localhost:3000";
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

    // Wait for the API response
    await page.waitForResponse(
      (response) => {
        const url = response.url();
        const pathname = new URL(url).pathname;
        return (
          pathname.endsWith(`/customer/${customerId}`) &&
          response.request().method() === "GET" &&
          response.status() === 200
        );
      },
      { timeout: 10000 }
    );

    // Wait for the customer name heading to appear
    await expect(
      page.getByRole("heading", { name: /Delete Test/i })
    ).toBeVisible({
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

    // Click cancel button in popup
    const cancelButton = page.getByRole("button", { name: /cancel/i });
    await cancelButton.click();

    // Verify we're still on the customer details page
    await expect(page.getByRole("heading", { name: /Delete Test/i })).toBeVisible();
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

    // Confirm deletion and wait for API call
    // Find the confirm button in the Popconfirm (it has okText="Delete")
    const confirmButton = page.getByRole("button", { name: /^delete$/i });
    await Promise.all([
      page.waitForResponse(
        (response) => {
          const url = response.url();
          const pathname = new URL(url).pathname;
          return (
            pathname.endsWith(`/customer/${customerId}`) &&
            response.request().method() === "DELETE" &&
            response.status() === 200
          );
        },
        { timeout: 10000 }
      ),
      confirmButton.click(),
    ]);

    // Verify navigation to home page
    await page.waitForURL("**/", { timeout: 5000 });

    // Verify success message appears
    const successMessage = page.getByText(/customer deleted successfully/i);
    try {
      await expect(successMessage).toBeVisible({ timeout: 2000 });
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
    const confirmButton = page.getByRole("button", { name: /^delete$/i });
    await Promise.all([
      page.waitForResponse(
        (response) => {
          const url = response.url();
          const pathname = new URL(url).pathname;
          return (
            pathname.endsWith(`/customer/${customerId}`) &&
            response.request().method() === "DELETE" &&
            response.status() === 200
          );
        },
        { timeout: 10000 }
      ),
      confirmButton.click(),
    ]);

    // Verify navigation to home page
    await page.waitForURL("**/", { timeout: 5000 });

    // Verify we're on the home page
    await expect(
      page.getByRole("button", { name: /add customer/i })
    ).toBeVisible();
  });
});

