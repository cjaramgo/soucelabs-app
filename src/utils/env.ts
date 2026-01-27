import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment configuration utility
 * Centralizes all environment variable access
 */
export const ENV = {
  // Base URL
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',

  // User credentials
  STANDARD_USER: process.env.STANDARD_USER || 'standard_user',
  STANDARD_PASSWORD: process.env.STANDARD_PASSWORD || 'secret_sauce',


  // Browser configuration
  DEFAULT_BROWSER: process.env.DEFAULT_BROWSER || 'chromium',
  HEADLESS: process.env.HEADLESS === 'true',

  // Timeouts
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
  NAVIGATION_TIMEOUT: parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10),

  // Retry configuration
  RETRY_COUNT: parseInt(process.env.RETRY_COUNT || '2', 10),

  // Screenshot configuration
  SCREENSHOT_ON_FAILURE: process.env.SCREENSHOT_ON_FAILURE === 'true',
} as const;

/**
 * Get storage state file path for authenticated sessions
 */
export function getStorageStatePath(): string {
  return path.resolve(process.cwd(), 'src/tests/.auth/storage-state.json');
}

