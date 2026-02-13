import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3002",
  },
  webServer: {
    command: "PORT=3002 npm run dev",
    port: 3002,
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
