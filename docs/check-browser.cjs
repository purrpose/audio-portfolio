const { chromium, screenshots, baseURL } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.route('https://w.soundcloud.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Test embed</title></html>' }));
    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><title>Test reel</title></html>' }));
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.project').count(), 6);
    assert.equal(await page.locator('.track').count(), 4);
    const samples = await page.evaluate(() => PORTFOLIO.sfx);
    const pending = samples.filter(sample => !sample.src?.trim()).length;
    assert.equal(await page.locator('iframe').count(), 0, 'No external players before interaction');
    assert.equal(await page.locator('#samples audio').count(), samples.length - pending);
    assert.equal(await page.locator('#samples audio').evaluateAll(items => items.every(a => a.paused)), true, 'No audio autoplay');
    assert.equal(await page.locator('#samples-empty').isVisible(), samples.length === 0);
    assert.equal(await page.locator('#samples-pending-note').isVisible(), pending > 0);
    assert.equal(await page.locator('#samples .sample.is-pending').count(), pending);
    assert.equal(await page.locator('#samples button:disabled').count(), pending);
    assert.equal(await page.locator('#samples .is-pending input:disabled').count(), pending);
    assert.equal(await page.locator('.section-index, .track-index, .sample-index, .project-number').count(), 0);
    assert.equal(await page.locator('.project-description').count(), 6);
    assert.deepEqual(await page.locator('main > section[id]').evaluateAll(sections => sections.map(s => s.id)), ['top', 'showreel', 'music', 'sound-design', 'work', 'about', 'skills', 'contact']);
    assert.equal(await page.locator('.brand-mark path').count(), 1);
    assert.equal(await page.locator('#music-title [data-i18n]').textContent(), 'Music');
    assert.match(await page.locator('body').evaluate(n => getComputedStyle(n).fontFamily), /^"Courier New"/);
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /woff|fonts\.google/.test(r.name)).length), 0, 'Only system fonts');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    for (const lang of ['en', 'ru']) {
      await page.locator(`[data-lang=${lang}]`).click();
      await page.evaluate(() => document.fonts.ready);
      for (const width of [1920, 1440, 1280, 1024, 901, 900, 820, 768, 601, 600, 430, 390, 360, 320]) {
        await page.setViewportSize({ width, height: 900 });
        // Load every lazy image before asserting and capturing it.
        await page.locator('img').evaluateAll(async images => {
          await Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); }));
        });
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          overflowNodes: [...document.body.querySelectorAll('*')].filter(n => n.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map(n => n.className),
          brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
          brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.href),
          unsafeLinks: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).length,
          missingTranslations: [...document.querySelectorAll('[data-i18n]')].filter(n => !PORTFOLIO.text[document.documentElement.lang][n.dataset.i18n]).map(n => n.dataset.i18n)
        }));
        assert.equal(result.overflow, false, `${lang} ${width}: overflow ${result.overflowNodes}`);
        assert.deepEqual(result.brokenImages, []);
        assert.deepEqual(result.brokenAnchors, []);
        assert.equal(result.unsafeLinks, 0);
        assert.deepEqual(result.missingTranslations, []);
        assert.ok(await page.locator('.reel-stage').evaluate(node => node.clientHeight >= 200), 'YouTube minimum viewport height');
        await page.evaluate(() => scrollTo(0, 0));
        if ([1440, 390].includes(width)) await page.screenshot({ path: path.join(screenshots, `${lang}-${width}.png`), fullPage: true });
        console.log(`PASS ${lang} ${width}px: layout, images, anchors, translations`);
      }
    }
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(n => n === document.activeElement), true, 'Keyboard skip link');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main').evaluate(n => n === document.activeElement), true);
    await page.locator('.menu-button').click();
    assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
    await page.locator('.menu-button').click();
    await page.locator('#navigation a[href="#work"]').click();
    assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
    await page.locator('#discord-copy').click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'purposey');
    await page.locator('.load-player').first().click();
    assert.match(await page.locator('.player-frame').getAttribute('src'), /auto_play=false/);
    await page.locator('.load-player').nth(1).click();
    assert.equal(await page.locator('.player-frame').count(), 1, 'Only one external music player');
    const source = await page.locator('.player-frame').getAttribute('src');
    await page.locator('[data-lang=en]').click();
    assert.equal(await page.locator('.player-frame').getAttribute('src'), source, 'Language switch preserves playback');
    await page.locator('#showreel-content button').click();
    assert.equal(await page.locator('.player-frame').count(), 0, 'Reel stops music');
    assert.equal(await page.locator('#showreel-content iframe').count(), 1);
    await page.locator('.load-player').first().click();
    assert.equal(await page.locator('#showreel-content iframe').count(), 0, 'Music stops reel');
    await page.locator('.load-player').first().click();
    assert.equal(await page.locator('iframe').count(), 0, 'Close removes player');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshots, 'desktop-hero.png') });
    // Viewport captures avoid sticky-header artifacts from tall element screenshots.
    for (const [width, lang] of [[1440, 'en'], [390, 'ru']]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator(`[data-lang=${lang}]`).click();
      for (const id of ['top', 'showreel', 'music', 'sound-design', 'work', 'about', 'skills']) {
        await page.locator(`#${id}`).evaluate(n => scrollTo(0, n.getBoundingClientRect().top + scrollY - 88));
        await page.screenshot({ path: path.join(screenshots, `archive-${id}-${width}.png`) });
      }
    }
    const noStorage = await context.newPage();
    await noStorage.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
    await noStorage.goto(baseURL);
    assert.equal(await noStorage.locator('html').getAttribute('lang'), 'en');
    await noStorage.locator('[data-lang=ru]').click();
    assert.equal(await noStorage.locator('html').getAttribute('lang'), 'ru');
    assert.deepEqual(errors, []);
    console.log('PASS menu, reduced motion, clipboard, storage, media coordination; no console errors');
    console.log('Screenshots:', screenshots);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
