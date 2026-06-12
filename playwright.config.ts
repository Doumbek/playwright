import { defineConfig, devices } from "@playwright/test";
import { initDotEnv, envConfig } from "@utils/config.utils";

initDotEnv();

export default defineConfig({
  testDir: "./tests",

  // --- Timeouts ---
  timeout: 30_000,
  globalTimeout: process.env.CI ? 10 * 60 * 1_000 : 0,

  // --- Execution ---
  fullyParallel: true,
  workers: process.env.CI ? "50%" : undefined,
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  // --- Reporting ---
  reporter: [["list", { printSteps: true }], ["html", { open: "never" }]],

  // --- Shared browser options ---
  use: {
    baseURL: envConfig.baseUrl,
    testIdAttribute: "data-test",

    // Timeouts
    actionTimeout: 10_000,
    navigationTimeout: 30_000,

    // Recording — retained only on failure, no cost on passing tests
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",

    // Practice site uses self-signed cert — safe to ignore here
    ignoreHTTPSErrors: true,

    // Slow down actions locally for debugging — set SLOWMO=1 to activate
    launchOptions: {
      slowMo: process.env.SLOWMO ? 500 : 0,
    },
  },

  projects: [
    // {
    //   name: 'chromium',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read"],
      },
    },
  ],
});
