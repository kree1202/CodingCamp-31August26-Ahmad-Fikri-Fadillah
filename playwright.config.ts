import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Match only .spec.ts / .spec.js files (not the .py script)
  testMatch: '**/*.spec.{ts,js}',
  timeout: 15_000,
  retries: 0,
  use: {
    // No base URL needed — each test constructs a file:/// URL directly
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
