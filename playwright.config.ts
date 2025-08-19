import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 3,
  timeout: 60 * 1000, // Maximum time one test can run for (30 seconds)
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'allure-playwright',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'https://automationexercise.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
