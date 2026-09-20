// Optional developer check. Playwright is installed outside the deployed website.
const { chromium } = require(process.env.TEMP + '/portfolio-browser-check/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('.project-card').count(), 6);
  assert.equal(await page.locator('iframe').count(), 0, 'No third-party player before interaction');
  assert.equal(await page.locator('#showreel-content').innerText().then(t => t.includes('coming soon')), true);
  const screenshots = path.join(process.env.TEMP, 'portfolio-browser-check', 'screenshots');
  fs.mkdirSync(screenshots, { recursive: true });
  for (const lang of ['en', 'ru']) {
    await page.locator(`[data-lang=${lang}]`).click();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(150);
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
        brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.querySelector(a.getAttribute('href'))).map(a => a.outerHTML),
        unsafeLinks: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).length,
        missingTranslations: [...document.querySelectorAll('[data-i18n]')].filter(n => !window.PORTFOLIO.text[document.documentElement.lang][n.dataset.i18n]).length
      }));
      assert.equal(result.overflow, false, `${lang} ${width}: horizontal overflow`);
      assert.deepEqual(result.brokenImages, []);
      assert.deepEqual(result.brokenAnchors, []);
      assert.equal(result.unsafeLinks, 0);
      assert.equal(result.missingTranslations, 0);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (width === 390 || width === 1440) await page.screenshot({ path: path.join(screenshots, `${lang}-${width}.png`), fullPage: true });
      console.log(`PASS ${lang} at ${width}px`);
    }
  }
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'ru', 'Language persists');
  await page.locator('.menu-button').click();
  assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
  await page.locator('.menu-button').click();
  await page.locator('#navigation a[href="#work"]').click();
  assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
  assert.equal(new URL(page.url()).hash, '#work');
  await page.locator('.load-player').first().click();
  assert.match(await page.locator('.player-frame').getAttribute('src'), /auto_play=false/);
  const frameSrc = await page.locator('.player-frame').getAttribute('src');
  await page.locator('[data-lang=en]').click();
  assert.equal(await page.locator('.player-frame').getAttribute('src'), frameSrc, 'Language switch preserves player');
  await page.waitForTimeout(5000);
  const sc = page.frames().find(f => f.url().includes('w.soundcloud.com'));
  console.log('SoundCloud frame:', sc ? (await sc.locator('body').innerText().catch(() => 'unavailable')).slice(0, 1200) : 'unavailable');
  console.log('Page errors:', errors);
  assert.deepEqual(errors, []);
  // Storage-denied environments should still load and switch language.
  const noStorage = await context.newPage();
  await noStorage.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
  await noStorage.goto('http://127.0.0.1:4173');
  assert.equal(await noStorage.locator('html').getAttribute('lang'), 'en');
  await noStorage.locator('[data-lang=ru]').click();
  assert.equal(await noStorage.locator('html').getAttribute('lang'), 'ru');
  console.log('PASS navigation, persistence, player mounting, storage fallback, asset and anchor checks');
  console.log('Screenshots:', screenshots);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
