import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  expect: { timeout: 10_000 },
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'], browserName: 'firefox' } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], browserName: 'webkit' } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'], browserName: 'webkit' } }
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
