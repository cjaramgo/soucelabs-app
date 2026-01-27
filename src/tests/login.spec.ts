import { test, expect } from '../fixtures/page-fixtures';
import { ENV } from '../utils/env';

/**
 * Login Tests
 * This suite tests the login functionality including successful and failed authentication scenarios
 */

test.beforeEach(async ({ loginPage, page }) => {
  // Navigate to login page
  await loginPage.navigate();
});


test.describe('Login Flow', () => {
  test.describe('Successful Authentication', () => {
    test('should login successfully with valid credentials', async ({ loginPage, inventoryPage, page }) => {

      // Login with standard user
      await loginPage.loginStandardUser();

      // Verify redirect to inventory page
      await page.waitForURL('**/inventory.html');
      await expect(page).toHaveURL(/.*inventory.html/);

      // Verify inventory page header
      const header = await inventoryPage.getPageHeader();
      expect(header).toBe('Products');
    });

    test('should display products after successful login', async ({ loginPage, inventoryPage, page }) => {
      await loginPage.loginStandardUser();

      await page.waitForURL('**/inventory.html');

      // Verify products are displayed
      const productCount = await inventoryPage.getInventoryItemsCount();
      expect(productCount).toBeGreaterThan(0);

      // Verify known product is present
      const productNames = await inventoryPage.getAllProductNames();
      expect(productNames).toContain('Sauce Labs Backpack');
    });

    test('should maintain session after page refresh', async ({ loginPage, page }) => {
      await loginPage.loginStandardUser();

      await page.waitForURL('**/inventory.html');

      // Refresh the page
      await page.reload();

      // Verify still logged in
      await expect(page).toHaveURL(/.*inventory.html/);
    });
  });

  test.describe('Failed Authentication', () => {
    test('should show error for invalid username', async ({ loginPage }) => {

      // Attempt login with invalid username
      await loginPage.login('invalid_user', ENV.STANDARD_PASSWORD);

      // Verify error message
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Username and password do not match');
    });

    test('should show error for invalid password', async ({ loginPage }) => {

      // Attempt login with invalid password
      await loginPage.login(ENV.STANDARD_USER, 'wrong_password');

      // Verify error message
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Username and password do not match');
    });

    test('should show error for empty username', async ({ loginPage }) => {

      // Attempt login with empty username
      await loginPage.login('', ENV.STANDARD_PASSWORD);

      // Verify error message
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Username is required');
    });

    test('should show error for empty password', async ({ loginPage }) => {

      // Attempt login with empty password
      await loginPage.login(ENV.STANDARD_USER, '');

      // Verify error message
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Password is required');
    });

  });

  test.describe('Error Handling', () => {
    test('should be able to close error message', async ({ loginPage }) => {

      // Trigger an error
      await loginPage.login('', '');

      // Verify error is displayed
      expect(await loginPage.isErrorDisplayed()).toBe(true);

      // Close the error
      await loginPage.closeError();

      // Verify error is no longer visible
      expect(await loginPage.isErrorDisplayed()).toBe(false);
    });

  });

  test.describe('Logout Functionality', () => {
    test('should logout successfully', async ({ loginPage, inventoryPage, page }) => {
      await loginPage.loginStandardUser();

      await page.waitForURL('**/inventory.html');

      // Logout
      await inventoryPage.logout();

      // Verify redirected to login page
      await page.waitForURL(ENV.BASE_URL);
      expect(await loginPage.isDisplayed()).toBe(true);
    });

    test('should not access inventory page after logout', async ({ loginPage, inventoryPage, page }) => {
      await loginPage.loginStandardUser();

      await page.waitForURL('**/inventory.html');
      await inventoryPage.logout();

      // Try to access inventory directly
      await page.goto(`${ENV.BASE_URL}/inventory.html`);

      // Should be redirected to login or show error
      const currentUrl = page.url();
      const isOnInventory = currentUrl.includes('inventory.html');

      if (isOnInventory) {
        // If on inventory page, login should be displayed (overlay or redirect)
        expect(await loginPage.isDisplayed()).toBe(true);
      } else {
        // Otherwise, should be on login page
        expect(currentUrl).toContain(ENV.BASE_URL);
      }
    });
  });
});
