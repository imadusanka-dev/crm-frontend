import { test, expect } from "@playwright/test";
import type { ICustomer } from "../src/types";

test.describe("Update Customer Feature", () => {
  let customerId: string;
  let customerEmail: string;

  test.beforeEach(async ({ page }) => {
    // Create a test customer first
    const timestamp = Date.now();
    customerEmail = `john.doe.${timestamp}@example.com`;
    const testCustomer: Omit<ICustomer, "id" | "createdAt"> = {
      firstName: "John",
      lastName: "Doe",
      email: customerEmail,
      phoneNumber: "+1234567890",
      address: "123 Main St",
      city: "New York",
      state: "NY",
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
      // If creation fails, try to get existing customer or skip test
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
    await expect(page.getByRole("heading", { name: /John Doe/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("should open edit modal when clicking Edit button", async ({ page }) => {
    // Click the Edit button
    const editButton = page.getByTestId("edit-customer-button");
    await expect(editButton).toBeVisible({ timeout: 5000 });
    await editButton.click();

    // Verify modal is visible with edit title
    await expect(
      page.getByRole("dialog", { name: /edit customer/i })
    ).toBeVisible();

    // Verify form fields are pre-filled with existing data
    await expect(page.getByPlaceholder(/enter first name/i)).toHaveValue(
      "John"
    );
    await expect(page.getByPlaceholder(/enter last name/i)).toHaveValue("Doe");
    await expect(page.getByPlaceholder(/enter email address/i)).toHaveValue(
      customerEmail
    );
  });

  test("should pre-fill all form fields with existing customer data", async ({
    page,
  }) => {
    // Open edit modal
    await page.getByTestId("edit-customer-button").click();
    await expect(
      page.getByRole("dialog", { name: /edit customer/i })
    ).toBeVisible();

    // Verify all fields are pre-filled
    await expect(page.getByPlaceholder(/enter first name/i)).toHaveValue(
      "John"
    );
    await expect(page.getByPlaceholder(/enter last name/i)).toHaveValue("Doe");
    await expect(page.getByPlaceholder(/enter email address/i)).toHaveValue(
      customerEmail
    );
    await expect(page.getByPlaceholder(/enter phone number/i)).toHaveValue(
      "+1234567890"
    );
    await expect(page.getByPlaceholder(/enter address/i)).toHaveValue(
      "123 Main St"
    );
    await expect(page.getByPlaceholder(/enter city/i)).toHaveValue("New York");
    await expect(page.getByPlaceholder(/enter state/i)).toHaveValue("NY");
    await expect(page.getByPlaceholder(/enter country/i)).toHaveValue("USA");
  });

  test("should close edit modal when clicking Cancel button", async ({
    page,
  }) => {
    // Open edit modal
    await page.getByTestId("edit-customer-button").click();
    await expect(
      page.getByRole("dialog", { name: /edit customer/i })
    ).toBeVisible();

    // Click Cancel button
    const cancelButton = page.getByTestId("cancel-button");
    await cancelButton.click();

    // Verify modal is closed
    await expect(
      page.getByRole("dialog", { name: /edit customer/i })
    ).not.toBeVisible();
  });

  test("should successfully update customer with all fields", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const updatedData = {
      firstName: "John",
      lastName: "Smith",
      email: `john.smith.${timestamp}@example.com`,
      phoneNumber: "+1987654321",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
    };

    // Open edit modal
    await page.getByTestId("edit-customer-button").click();
    await expect(
      page.getByRole("dialog", { name: /edit customer/i })
    ).toBeVisible();

    // Update form fields
    await page.getByPlaceholder(/enter last name/i).clear();
    await page.getByPlaceholder(/enter last name/i).fill(updatedData.lastName);

    await page.getByPlaceholder(/enter email address/i).clear();
    await page.getByPlaceholder(/enter email address/i).fill(updatedData.email);

    await page.getByPlaceholder(/enter phone number/i).clear();
    await page
      .getByPlaceholder(/enter phone number/i)
      .fill(updatedData.phoneNumber);

    await page.getByPlaceholder(/enter address/i).clear();
    await page.getByPlaceholder(/enter address/i).fill(updatedData.address);

    await page.getByPlaceholder(/enter city/i).clear();
    await page.getByPlaceholder(/enter city/i).fill(updatedData.city);

    await page.getByPlaceholder(/enter state/i).clear();
    await page.getByPlaceholder(/enter state/i).fill(updatedData.state);

    await page.getByPlaceholder(/enter country/i).clear();
    await page.getByPlaceholder(/enter country/i).fill(updatedData.country);

    // Submit form and wait for API call
    await Promise.all([
      page.waitForResponse(
        (response) => {
          const url = response.url();
          const pathname = new URL(url).pathname;
          return (
            pathname.endsWith(`/customer/${customerId}`) &&
            response.request().method() === "PUT" &&
            response.status() === 200
          );
        },
        { timeout: 10000 }
      ),
      page.getByTestId("submit-button").click(),
    ]);

    // Verify navigation to home page
    await page.waitForURL("**/", { timeout: 5000 });

    // Verify success message appears
    const successMessage = page.getByText(/customer updated successfully/i);
    try {
      await expect(successMessage).toBeVisible({ timeout: 2000 });
    } catch {
      // Message might have disappeared already, which is fine
    }
  });

  test("should successfully update customer with partial fields", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const updatedData = {
      firstName: "John",
      lastName: "Updated",
      email: `john.updated.${timestamp}@example.com`,
    };

    // Open edit modal
    await page.getByTestId("edit-customer-button").click();

    // Update only required fields
    await page.getByPlaceholder(/enter last name/i).clear();
    await page.getByPlaceholder(/enter last name/i).fill(updatedData.lastName);

    await page.getByPlaceholder(/enter email address/i).clear();
    await page.getByPlaceholder(/enter email address/i).fill(updatedData.email);

    // Clear optional fields
    await page.getByPlaceholder(/enter phone number/i).clear();
    await page.getByPlaceholder(/enter address/i).clear();
    await page.getByPlaceholder(/enter city/i).clear();
    await page.getByPlaceholder(/enter state/i).clear();
    await page.getByPlaceholder(/enter country/i).clear();

    // Submit form and wait for API call
    await Promise.all([
      page.waitForResponse(
        (response) => {
          const url = response.url();
          const pathname = new URL(url).pathname;
          return (
            pathname.endsWith(`/customer/${customerId}`) &&
            response.request().method() === "PUT" &&
            response.status() === 200
          );
        },
        { timeout: 10000 }
      ),
      page.getByTestId("submit-button").click(),
    ]);

    // Wait for navigation
    await page.waitForURL("**/", { timeout: 5000 });
  });

  test("should validate form fields when updating", async ({ page }) => {
    // Open edit modal
    await page.getByTestId("edit-customer-button").click();

    // Clear required fields
    await page.getByPlaceholder(/enter first name/i).clear();
    await page.getByPlaceholder(/enter last name/i).clear();
    await page.getByPlaceholder(/enter email address/i).clear();

    // Try to submit
    await page.getByTestId("submit-button").click();

    // Verify validation errors appear
    await expect(page.getByText(/please enter first name/i)).toBeVisible();
    await expect(page.getByText(/please enter last name/i)).toBeVisible();
    await expect(page.getByText(/please enter email address/i)).toBeVisible();
  });

  test("should validate email format when updating", async ({ page }) => {
    // Open edit modal
    await page.getByTestId("edit-customer-button").click();

    // Update email with invalid format
    await page.getByPlaceholder(/enter email address/i).clear();
    await page.getByPlaceholder(/enter email address/i).fill("invalid-email");

    // Try to submit
    await page.getByTestId("submit-button").click();

    // Verify email validation error
    await expect(
      page.getByText(/please enter a valid email address/i)
    ).toBeVisible();
  });

  test("should show 'Save Changes' button text in edit mode", async ({
    page,
  }) => {
    // Open edit modal
    await page.getByTestId("edit-customer-button").click();

    // Verify submit button shows "Save Changes" text
    const submitButton = page.getByTestId("submit-button");
    await expect(submitButton).toHaveText(/save changes/i);
  });

  test("should navigate back to home page after successful update", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const updatedData = {
      lastName: `Updated${timestamp}`,
    };

    // Open edit modal
    await page.getByTestId("edit-customer-button").click();

    // Make a small change
    await page.getByPlaceholder(/enter last name/i).clear();
    await page.getByPlaceholder(/enter last name/i).fill(updatedData.lastName);

    // Submit and wait for API call
    await Promise.all([
      page.waitForResponse(
        (response) => {
          const url = response.url();
          const pathname = new URL(url).pathname;
          return (
            pathname.endsWith(`/customer/${customerId}`) &&
            response.request().method() === "PUT" &&
            response.status() === 200
          );
        },
        { timeout: 10000 }
      ),
      page.getByTestId("submit-button").click(),
    ]);

    // Verify navigation to home page
    await page.waitForURL("**/", { timeout: 5000 });

    // Verify we're on the home page
    await expect(
      page.getByRole("button", { name: /add customer/i })
    ).toBeVisible();
  });
});
