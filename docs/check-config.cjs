const { chromium, baseURL } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const [url, expected] of [
      ['https://www.youtube.com/watch?v=abcdefghijk', 'iframe'],
      ['https://youtu.be/abcdefghijk', 'iframe'],
      ['https://www.youtube.com/embed/abcdefghijk', 'iframe'],
      ['https://example.com/reel.mp4', 'video'],
      ['https://example.com/reel.webm', 'video'],
      ['assets/video/test-reel.mp4', 'video'],
      ['assets/video/test-reel.webm', 'video'],
      ['https://example.com/video-page', 'a'],
      ['', 'p']
    ]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      page.on('pageerror', error => console.error(`Page error for ${url}:`, error.message));
      await page.route('**/portfolio-data.js', async route => {
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()) + `\nPORTFOLIO.showreelUrl = ${JSON.stringify(url)};` });
      });
      await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ body: '<html></html>', contentType: 'text/html' }));
      await page.route('https://example.com/**', route => route.fulfill({ body: '', contentType: 'video/mp4' }));
      await page.route('**/assets/video/test-reel.*', route => route.fulfill({ body: '', contentType: 'video/mp4' }));
      await page.goto(baseURL);
      await page.waitForFunction(() => document.querySelectorAll('.project').length === 6);
      assert.equal(await page.locator('#showreel-content iframe, #showreel-content video').count(), 0, 'Never load before interaction');
      if (['a', 'p'].includes(expected)) assert.equal(await page.locator(`#showreel-content ${expected}`).count(), 1);
      else {
        await page.locator('#showreel-content button').click();
        assert.equal(await page.locator(`#showreel-content ${expected}`).count(), 1);
        await page.locator('[data-lang=ru]').click();
        assert.equal(await page.locator(`#showreel-content ${expected}`).getAttribute('aria-label'), 'ШОУРИЛ ИГРОВОГО АУДИО');
      }
      console.log(`PASS reel configuration: ${url || '(empty)'}`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
