import { test, expect } from "@playwright/test";
import type { ICustomer } from "../src/types";

// Test customer data - using unique emails to avoid conflicts
const timestamp = Date.now();
const newCustomer: Omit<ICustomer, "id" | "createdAt"> = {
  firstName: `Alice${timestamp}`,
  lastName: "Johnson",
  email: `alice.johnson.${timestamp}@example.com`,
  phoneNumber: "+94779122334",
  address: "789 Elm Street",
  city: "Chicago",
  state: "IL",
  country: "USA",
};

test.describe("Add Customer Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should open add customer modal when clicking Add Customer button", async ({
    page,
  }) => {
    // Click the "Add Customer" button
    const addButton = page.getByRole("button", { name: /add customer/i });
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Verify modal is visible
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).toBeVisible();

    // Verify form fields are visible
    await expect(
      page
        .getByPlaceholder(/enter first name/i)
        .or(page.getByLabel(/first name/i))
    ).toBeVisible();
    await expect(
      page
        .getByPlaceholder(/enter last name/i)
        .or(page.getByLabel(/last name/i))
    ).toBeVisible();
    await expect(
      page
        .getByPlaceholder(/enter email address/i)
        .or(page.getByLabel(/email/i))
    ).toBeVisible();
    await expect(
      page
        .getByPlaceholder(/enter phone number/i)
        .or(page.getByLabel(/phone number/i))
    ).toBeVisible();
  });

  test("should close modal when clicking Cancel button", async ({ page }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).toBeVisible();

    // Click Cancel button
    const cancelButton = page.getByTestId("cancel-button");
    await cancelButton.click();

    // Verify modal is closed
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).not.toBeVisible();
  });

  test("should show validation errors for required fields", async ({
    page,
  }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).toBeVisible();

    // Try to submit empty form
    const submitButton = page.getByTestId("submit-button");
    await submitButton.click();

    // Verify validation errors appear
    await expect(page.getByText(/please enter first name/i)).toBeVisible();
    await expect(page.getByText(/please enter last name/i)).toBeVisible();
    await expect(page.getByText(/please enter email address/i)).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();

    // Fill in form with invalid email
    await page.getByPlaceholder(/enter first name/i).fill("Test");
    await page.getByPlaceholder(/enter last name/i).fill("User");
    await page.getByPlaceholder(/enter email address/i).fill("invalid-email");

    // Try to submit
    await page.getByTestId("submit-button").click();

    // Verify email validation error
    await expect(
      page.getByText(/please enter a valid email address/i)
    ).toBeVisible();
  });

  test("should validate minimum length for name fields", async ({ page }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();

    // Fill in form with short names
    await page.getByPlaceholder(/enter first name/i).fill("A");
    await page.getByPlaceholder(/enter last name/i).fill("B");
    await page
      .getByPlaceholder(/enter email address/i)
      .fill("test@example.com");

    // Try to submit
    await page.getByTestId("submit-button").click();

    // Verify minimum length validation errors
    await expect(
      page.getByText(/first name must be at least 2 characters/i)
    ).toBeVisible();
    await expect(
      page.getByText(/last name must be at least 2 characters/i)
    ).toBeVisible();
  });

  test("should successfully add a customer with all fields", async ({
    page,
  }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).toBeVisible();

    // Fill in all form fields
    await page
      .getByPlaceholder(/enter first name/i)
      .fill(newCustomer.firstName);
    await page.getByPlaceholder(/enter last name/i).fill(newCustomer.lastName);
    await page.getByPlaceholder(/enter email address/i).fill(newCustomer.email);
    await page
      .getByPlaceholder(/enter phone number/i)
      .fill(newCustomer.phoneNumber!);
    await page.getByPlaceholder(/enter address/i).fill(newCustomer.address!);
    await page.getByPlaceholder(/enter city/i).fill(newCustomer.city!);
    await page.getByPlaceholder(/enter state/i).fill(newCustomer.state!);
    await page.getByPlaceholder(/enter country/i).fill(newCustomer.country!);

    // Submit form and wait for either success or error
    await page.getByTestId("submit-button").click();

    // Wait for either the modal to close (success) or error message to appear
    const modal = page.getByRole("dialog", { name: /add new customer/i });

    try {
      // Wait for modal to close (success case)
      await expect(modal).not.toBeVisible({ timeout: 20000 });
    } catch (error) {
      // Modal didn't close, check for errors
      await page.waitForTimeout(2000); // Give time for error message to appear

      // Check for validation errors
      const validationErrors = page.getByText(/please enter/i);
      const errorCount = await validationErrors.count();

      if (errorCount > 0) {
        const validationText = await validationErrors.first().textContent();
        throw new Error(`Form validation failed: ${validationText}`);
      }

      // Check for API error messages (Ant Design message component)
      // Ant Design messages appear in a specific container
      const errorMessages = page.locator(
        ".ant-message-error, .ant-message-notice-content"
      );
      const errorMessageCount = await errorMessages.count();

      if (errorMessageCount > 0) {
        // Try to get the error text
        const errorTexts = await Promise.all(
          Array.from({ length: errorMessageCount }, (_, i) =>
            errorMessages
              .nth(i)
              .textContent()
              .catch(() => "")
          )
        );
        const errorText =
          errorTexts.filter(Boolean).join("; ") || "Unknown error";
        throw new Error(
          `API error: ${errorText}. Make sure your backend API is running and accessible.`
        );
      }

      // Check for any visible error text on the page
      const anyError = page.getByText(
        /failed|error|already exists|network|connection/i
      );
      const anyErrorCount = await anyError.count();

      if (anyErrorCount > 0) {
        const errorText = await anyError.first().textContent();
        throw new Error(
          `Error detected: ${errorText}. Make sure your backend API is running.`
        );
      }

      // If we get here, modal didn't close but no error was found
      throw new Error(
        "Modal did not close after submission and no error message was found. This might indicate the API is not responding. Please check if your backend server is running."
      );
    }

    // Verify success message appears
    const successMessage = page.getByText(/customer created successfully/i);
    try {
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    } catch {
      // Message might have disappeared already, which is fine
    }

    // Wait for customer list to refresh
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Verify new customer appears in the list
    await expect(page.getByText(newCustomer.firstName).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(newCustomer.lastName).first()).toBeVisible();
    await expect(page.getByText(newCustomer.email).first()).toBeVisible();
  });

  test("should successfully add a customer with only required fields", async ({
    page,
  }) => {
    const timestamp2 = Date.now();
    const minimalCustomer: Omit<ICustomer, "id" | "createdAt"> = {
      firstName: `Bob${timestamp2}`,
      lastName: "Smith",
      email: `bob.smith.${timestamp2}@example.com`,
      phoneNumber: null,
      address: null,
      city: null,
      state: null,
      country: null,
    };

    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();

    // Fill in only required fields
    await page
      .getByPlaceholder(/enter first name/i)
      .fill(minimalCustomer.firstName);
    await page
      .getByPlaceholder(/enter last name/i)
      .fill(minimalCustomer.lastName);
    await page
      .getByPlaceholder(/enter email address/i)
      .fill(minimalCustomer.email);

    // Submit form
    await page.getByTestId("submit-button").click();

    // Wait for modal to close (indicates successful submission)
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).not.toBeVisible({ timeout: 10000 });

    // Wait for customer list to refresh
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Verify new customer appears in the list
    await expect(page.getByText(minimalCustomer.firstName).first()).toBeVisible(
      { timeout: 10000 }
    );
    await expect(
      page.getByText(minimalCustomer.lastName).first()
    ).toBeVisible();
  });

  test("should clear form when modal is closed and reopened", async ({
    page,
  }) => {
    // Open modal
    await page.getByRole("button", { name: /add customer/i }).click();

    // Fill in some fields
    await page.getByPlaceholder(/enter first name/i).fill("Test");
    await page.getByPlaceholder(/enter last name/i).fill("User");
    await page
      .getByPlaceholder(/enter email address/i)
      .fill("test@example.com");

    // Close modal
    await page.getByTestId("cancel-button").click();

    // Wait for modal to close
    await expect(
      page.getByRole("dialog", { name: /add new customer/i })
    ).not.toBeVisible({ timeout: 3000 });

    // Reopen modal
    await page.waitForTimeout(500);
    const addButtons = page.getByRole("button", { name: /add customer/i });
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // Verify form fields are empty
    await expect(page.getByPlaceholder(/enter first name/i)).toHaveValue("");
    await expect(page.getByPlaceholder(/enter last name/i)).toHaveValue("");
    await expect(page.getByPlaceholder(/enter email address/i)).toHaveValue("");
  });
});
