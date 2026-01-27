import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { getStorageStatePath, ENV } from '../utils/env';

/**
 * Authentication Setup
 * This setup runs once before all authenticated tests to create a storage state
 * that can be reused, eliminating the need to login for each test
 */
setup('authenticate and save storage state', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.navigate();

  // Verify login page is displayed
  await expect(page).toHaveURL(ENV.BASE_URL);

  // Login with standard user
  await loginPage.loginStandardUser();

  // Wait for navigation to inventory page
  await page.waitForURL('**/inventory.html');
  await expect(page).toHaveURL(/.*inventory.html/);

  // Save storage state for reuse in authenticated tests
  await page.context().storageState({ path: getStorageStatePath() });
});
