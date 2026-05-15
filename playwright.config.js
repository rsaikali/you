const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:8200',
    },
    webServer: {
        // Lightweight static server — no Caddy/Docker needed for tests
        command: 'python3 -m http.server 8200 --directory www',
        url: 'http://localhost:8200',
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
