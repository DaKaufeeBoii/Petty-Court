import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const chromiumPath = process.env.CHROMIUM_PATH
  ?? (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4179',
    browserName: 'chromium',
    headless: true,
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'PORT=4179 BASE_PATH=/ pnpm run dev',
    url: 'http://127.0.0.1:4179',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
