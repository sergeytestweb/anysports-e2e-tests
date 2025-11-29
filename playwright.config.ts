// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html'], ['line'], ['json', { outputFile: 'test-results.json' }]],
    timeout: 60000, // 60 секунд timeout
    
    use: {
        baseURL: 'https://dev.anysports.tv/v2/ru/payment/create/677?p=1',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],

    // Web server for CI
    webServer: {
        command: 'echo "No server to start"',
        url: 'https://dev.anysports.tv/v2/ru/payment/create/677?p=1',
        reuseExistingServer: !process.env.CI,
    },
});