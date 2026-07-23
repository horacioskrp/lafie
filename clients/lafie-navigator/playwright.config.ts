import { defineConfig, devices } from '@playwright/test'

// E2E : requiert l'app servie sur http://localhost:3000 (docker compose up web)
// et les navigateurs Playwright installés (`npx playwright install`).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
