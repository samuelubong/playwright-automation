import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/testConfig';

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
