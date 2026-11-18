import { defineConfig, devices } from '@playwright/test';

// Jalankan lokal dengan Chromium yang sudah ada di cache (tanpa
// `npx playwright install`, yang menghapus cache browser tooling lain):
//   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux/chrome npm test
// Di CI variabel itu kosong dan Playwright memakai Chromium hasil
// `npx playwright install --with-deps chromium` di workflow.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ['--proxy-server=http://127.0.0.1:18081', '--no-sandbox', '--disable-dev-shm-usage'],
        }
      : {},
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'PORT=4173 node scripts/serve.mjs',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
