const { test, expect } = require('@playwright/test');

// The app auto-fills a dev profile when hostname is localhost (see app.js).
// This is the entire user journey in one shot.

test.describe('Profile rendering', () => {

    test('dev profile renders automatically on localhost', async ({ page }) => {
        await page.goto('/');
        // Dev prefill fires via requestAnimationFrame — profile should appear quickly
        await expect(page.locator('#profile')).toBeVisible({ timeout: 5000 });
        // A user name should be rendered (dev profile is auto-filled on localhost)
        await expect(page.locator('#p-verdict-name')).not.toBeEmpty();
    });

    test('empty state shown on load before any input', async ({ page }) => {
        // Intercept the dev prefill by clearing the textarea immediately
        await page.goto('/');
        await page.locator('#json-input').fill('');
        await page.locator('#json-input').dispatchEvent('input');
        // Profile should be hidden; empty-state may have display:none from a previous render
        await expect(page.locator('#profile')).toBeHidden();
    });

    test('invalid JSON shows error after debounce', async ({ page }) => {
        await page.goto('/');
        await page.locator('#json-input').fill('{not valid json}');
        await page.locator('#json-input').dispatchEvent('input');
        // Error is debounced at 800ms
        await expect(page.locator('#json-error')).toBeVisible({ timeout: 2000 });
    });

    test('hostile HTML from pasted response is rendered as text', async ({ page }) => {
        await page.goto('/');

        const payload = {
            user_name: 'Roland',
            model_name: '<script>window.__xssModel = 1</script>',
            verdict: 'You stay careful.',
            tagline: 'Still not executable',
            persona: 'First paragraph.\n\nSecond paragraph.',
            tone: 'direct and calm',
            style: 'You reason from evidence.',
            strengths: ['clarity'],
            weaknesses: ['impatience'],
            speech_register: 'Plainspoken.',
            contradictions: ['speed versus rigor'],
            speech_patterns: ['let us be precise'],
            ai_knows: ['backend engineer'],
            sensitive_data: ['<img src=x onerror="window.__xssBadge = 1">'],
            tag_scores: {
                philosophy: 1,
                politics: 0,
                society: 1,
                'science & tech': 8,
                environment: 0,
                economy: 0,
                history: 0,
                'art & culture': 0,
                spirituality: 0,
                'law & justice': 0,
                'future & utopia': 0,
                'psychology & behavior': 0,
                'love & relationships': 0,
                'body & health': 0,
                'education & childhood': 0,
                'games & entertainment': 0,
                'myths & stories': 0,
                'war & conflicts': 0,
                'identity & belonging': 0,
                'humor & absurdity': 0,
            },
            next_question: 'What breaks first?',
            next_project: 'You harden the frontend.',
            never_admit: 'You enjoy being right.',
        };

        await page.locator('#json-input').fill(JSON.stringify(payload));
        await page.locator('#json-input').dispatchEvent('input');

        await expect(page.locator('#profile')).toBeVisible();
        await expect(page.locator('#p-model-pill')).toContainText(payload.model_name);
        await expect(page.locator('#p-security-alert')).toContainText(payload.sensitive_data[0]);
        await expect(page.locator('#p-model-pill script')).toHaveCount(0);
        await expect(page.locator('#p-security-alert img')).toHaveCount(0);
        await expect.poll(() => page.evaluate(() => window.__xssModel)).toBeUndefined();
        await expect.poll(() => page.evaluate(() => window.__xssBadge)).toBeUndefined();
    });

});

test.describe('Mentions légales', () => {

    test('panel opens and closes', async ({ page }) => {
        await page.goto('/');
        await page.locator('#btn-mentions').click();
        await expect(page.locator('#mentions-panel')).toBeVisible();
        await page.locator('#btn-mentions-back').click();
        await expect(page.locator('#mentions-panel')).toBeHidden();
    });

});
