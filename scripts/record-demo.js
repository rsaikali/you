#!/usr/bin/env node
/**
 * Record a social media demo video of the You! app.
 *
 * Usage:  node scripts/record-demo.js
 * Output: test-results/demo.webm  (+  demo.mp4 if ffmpeg is available)
 *
 * Starts its own static server on port 8201 — no Docker needed.
 * The dev seed (Arthur) auto-loads because hostname is localhost.
 */

'use strict';

const { chromium } = require('@playwright/test');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT    = 8201;
const OUT_DIR = path.resolve(__dirname, '../test-results');
const FINAL_WEBM = path.join(OUT_DIR, 'demo.webm');
const FINAL_MP4  = path.join(OUT_DIR, 'demo.mp4');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    [FINAL_WEBM, FINAL_MP4].forEach(f => { try { fs.unlinkSync(f); } catch {} });

    // Lightweight static server (www/ directory)
    const server = spawn('python3', [
        '-m', 'http.server', String(PORT), '--directory', 'www',
    ], { stdio: 'ignore' });
    await sleep(900);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: {
            dir: OUT_DIR,
            size: { width: 1280, height: 720 },
        },
    });

    const page = await context.newPage();

    // Hide body before any page paint — revealed only once zoom is in place.
    // html background matches the sidebar so the recorder never sees white.
    await page.addInitScript(() => {
        const s = document.createElement('style');
        s.id = 'demo-init-hide';
        s.textContent = 'html { background: #1E2227 !important; } body { opacity: 0 !important; }';
        document.documentElement.prepend(s);
    });
    let videoPath;

    try {
        await page.goto(`http://localhost:${PORT}/`);

        // Dev seed auto-fills Arthur — wait for the profile card
        await page.waitForSelector('#profile:not([hidden])', { timeout: 8000 });

        // 1. Instantly zoom in on "You!" logo — centred in the viewport
        await page.evaluate(() => {
            const logo = document.querySelector('.app-logo');
            const rect = logo.getBoundingClientRect();
            const logoCX = rect.left + rect.width  / 2;
            const logoCY = rect.top  + rect.height / 2;
            const S  = 8;
            const tx = window.innerWidth  / 2 - logoCX * S;
            const ty = window.innerHeight / 2 - logoCY * S;

            // Fill the viewport background with the sidebar colour so no white bleeds in
            document.documentElement.style.background = '#1E2227';
            // Transform body (not html) — html background fills any exposed viewport area
            document.body.style.transformOrigin = '0 0';
            document.body.style.transform = `translate(${tx}px, ${ty}px) scale(${S})`;

            // Reveal — zoom is in place, no flash
            document.getElementById('demo-init-hide')?.remove();
        });

        // 2. Hold on the logo (zoomed) — let the viewer read it
        await sleep(1600);

        // 3. Zoom out to reveal the full layout (slow, 2.2s)
        await page.evaluate(() => {
            document.body.style.transition = 'transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.transform  = 'translate(0, 0) scale(1)';
        });
        await sleep(2400);

        // 4. Hold on full layout
        await sleep(700);

        // 5. Slow smooth scroll to the bottom of the profile (~3.2s, ease-in-out)
        await page.evaluate(() => {
            const container = document.querySelector('.main-scroll');
            if (!container) return;

            const startScroll = container.scrollTop;
            const endScroll   = container.scrollHeight - container.clientHeight;
            const duration    = 3200;
            const t0          = performance.now();

            function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

            function step(now) {
                const p = Math.min((now - t0) / duration, 1);
                container.scrollTop = startScroll + (endScroll - startScroll) * ease(p);
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });

        // 6. Let scroll finish + bars animate
        await sleep(3800);

        // 7. Hold on final state
        await sleep(1000);

        videoPath = await page.video()?.path();

    } finally {
        await context.close();   // triggers video flush
        await browser.close();
        server.kill();
    }

    if (!videoPath || !fs.existsSync(videoPath)) {
        console.error('Recording failed — no video file generated.');
        process.exit(1);
    }

    fs.renameSync(videoPath, FINAL_WEBM);
    console.log(`✓  WebM : ${FINAL_WEBM}`);

    // Convert to MP4 (Twitter-ready) if ffmpeg is available
    try {
        execSync('which ffmpeg', { stdio: 'ignore' });
        execSync(
            `ffmpeg -y -i "${FINAL_WEBM}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${FINAL_MP4}"`,
            { stdio: 'inherit' },
        );
        console.log(`✓  MP4  : ${FINAL_MP4}`);
    } catch {
        console.log('  ffmpeg not found — .webm only.\n  Install: brew install ffmpeg');
    }
}

main().catch(err => { console.error(err); process.exit(1); });
