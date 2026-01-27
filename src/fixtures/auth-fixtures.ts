import { test as base } from './page-fixtures';
import { getStorageStatePath } from '../utils/env';

/**
 * Authenticated test fixture
 * Uses storage state to bypass login for each test
 */
export const authenticatedTest = base.extend({
  storageState: getStorageStatePath(),
});

export { expect } from '@playwright/test';
