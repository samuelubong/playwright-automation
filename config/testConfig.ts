/**
 * Central place for environment-specific settings.
 * Values can be overridden with environment variables (e.g. in CI)
 * without touching any test code.
 */
export const testConfig = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
};

/**
 * Reads a value that must be supplied by the environment, such as a password.
 * Locally it comes from the .env file; in GitHub Actions it comes from repository secrets.
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Copy .env.example to .env and set it.`);
  }
  return value;
}
