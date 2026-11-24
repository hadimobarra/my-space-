import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Runs against the exported site: `npm run build` first.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    // PW_CHANNEL=chrome uses an installed Chrome instead of Playwright's own build.
    channel: process.env.PW_CHANNEL,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.PW_CHANNEL }, testMatch: /smoke|a11y/ },
  ],
  webServer: { command: "node scripts/serve.mjs", url: `http://127.0.0.1:${PORT}/`, reuseExistingServer: !process.env.CI },
});
