const { chromium } = require(process.env.TEMP + '/portfolio-browser-check/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  // URLs below are configuration fixtures. External video requests are intercepted.
  for (const [url, expected] of [
    ['https://www.youtube.com/watch?v=abcdefghijk', 'iframe'],
    ['https://youtu.be/abcdefghijk', 'iframe'],
    ['https://www.youtube.com/embed/abcdefghijk', 'iframe'],
    ['https://example.com/reel.mp4', 'video'],
    ['https://example.com/reel.webm', 'video'],
    ['https://example.com/video-page', 'a']
  ]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route('**/portfolio-data.js', async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: (await response.text()).replace('showreelUrl: ""', `showreelUrl: ${JSON.stringify(url)}`) });
    });
    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ body: '<html><body>Video fixture</body></html>', contentType: 'text/html' }));
    await page.route('https://example.com/**', route => route.fulfill({ body: '', contentType: 'video/mp4' }));
    await page.goto('http://127.0.0.1:4173');
    assert.equal(await page.locator('#showreel-content iframe, #showreel-content video').count(), 0);
    if (expected === 'a') {
      assert.equal(await page.locator('#showreel-content a').getAttribute('href'), url);
    } else {
      await page.locator('#showreel-content button').click();
      assert.equal(await page.locator(`#showreel-content ${expected}`).count(), 1);
      if (expected === 'iframe') assert.match(await page.locator('#showreel-content iframe').getAttribute('src'), /autoplay=0/);
      else assert.equal(await page.locator('#showreel-content video').evaluate(video => video.autoplay), false);
      await page.locator('[data-lang=ru]').click();
      assert.equal(await page.locator(`#showreel-content ${expected}`).getAttribute('aria-label'), 'Шоурил игрового аудио');
    }
    console.log(`PASS future showreel: ${url}`);
    await context.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
