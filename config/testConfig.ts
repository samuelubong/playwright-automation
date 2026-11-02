/**
 * Central place for environment-specific settings.
 * Values can be overridden with environment variables (e.g. in CI)
 * without touching any test code.
 */
export const testConfig = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
};
