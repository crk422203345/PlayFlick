import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:41733',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite --host 127.0.0.1 --port 41733 --strictPort',
    url: 'http://127.0.0.1:41733',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
