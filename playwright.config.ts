import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Test directory
  testDir: './src/tests',

  // Test file pattern
  testMatch: '**/*.spec.ts',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
  ],

  // Global timeout
  timeout: 30000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Shared settings for all projects
  use: {
    // Base URL from environment
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'on',

    // Video on failure
    video: 'on-first-retry',

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // data test id attribute
    testIdAttribute: 'data-test',
  },

  // Output directory for test artifacts
  outputDir: 'test-results',

  // Projects configuration
  projects: [
    // Authentication setup - runs first
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Chromium tests - depends on setup
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: 'src/tests/.auth/storage-state.json',
      },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },

    // Firefox tests - depends on setup
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        storageState: 'src/tests/.auth/storage-state.json',
      },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },

    // WebKit tests - depends on setup
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        storageState: 'src/tests/.auth/storage-state.json',
      },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
  ],
});
