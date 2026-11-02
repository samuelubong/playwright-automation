import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/testConfig';

// Load local secrets (e.g. SAUCE_PASSWORD) from .env. In CI they come from GitHub secrets instead.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: testConfig.uiBaseUrl,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: testConfig.apiBaseUrl,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});
