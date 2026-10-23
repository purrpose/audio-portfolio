// Synthesized test bytes are intercepted in the browser. No fixture is published
// as portfolio work and no test audio file is added to assets/.
const { chromium, baseURL } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');
function fixtureWav() {
  const rate = 8000, samples = rate * 6;
  const b = Buffer.alloc(44 + samples * 2);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) b.writeInt16LE(Math.round(Math.sin(i / rate * Math.PI * 2 * 220) * 1000), 44 + i * 2);
  return b;
}
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // First decode and exercise the actual configured files with their current IDs.
    await page.goto(baseURL);
    const configured = await page.evaluate(() => PORTFOLIO.sfx);
    assert.deepEqual(await page.locator('#samples .sample').evaluateAll(rows => rows.map(row => row.dataset.sample)), configured.map(sample => sample.id));
    for (const sample of configured.filter(sample => sample.src?.trim())) {
      const row = page.locator('#samples .sample').filter({ has: page.getByRole('heading', { name: sample.title, exact: true }) });
      assert.equal(await row.getAttribute('data-sample'), sample.id);
      await page.waitForFunction(id => {
        const audio = [...document.querySelectorAll('#samples .sample')].find(row => row.dataset.sample === id).querySelector('audio');
        if (audio.error) throw new Error(`Cannot decode ${id}: ${audio.error.message}`);
        return Number.isFinite(audio.duration) && audio.duration > 0;
      }, sample.id);
      const duration = await row.locator('audio').evaluate(audio => audio.duration);
      assert.equal(await row.locator('audio').evaluate(audio => audio.paused), true);
      await row.locator('button').click();
      await page.waitForFunction(id => [...document.querySelectorAll('#samples .sample')].find(row => row.dataset.sample === id).querySelector('audio').currentTime > 0.1, sample.id);
      await row.locator('button').click();
      assert.equal(await row.locator('audio').evaluate(audio => audio.paused), true);
      const slider = row.locator('input');
      const bounds = await slider.boundingBox();
      await slider.click({ position: { x: bounds.width / 2, y: bounds.height / 2 } });
      assert.ok(Math.abs(await row.locator('audio').evaluate(audio => audio.currentTime) - duration / 2) < 0.1, `Seeking: ${sample.id}`);
      for (const lang of ['ru', 'en']) {
        await page.locator(`[data-lang=${lang}]`).click();
        assert.equal(await row.locator('.sample-category').textContent(), sample.category[lang]);
        assert.equal(await row.locator('.sample-title').textContent(), sample.title);
      }
      assert.equal(await row.locator('audio').evaluate(audio => audio.error), null);
      console.log(`PASS actual SFX ${sample.id}: ${duration.toFixed(2)}s, decoding, play/pause, seeking, EN/RU`);
    }
    // The intercepted fixtures below separately cover error recovery and coordination.
    await page.route('**/portfolio-data.js', async route => {
      const response = await route.fetch();
      const fixture = { id: 'fixture-a', title: 'Test fixture A', category: { en: 'TEST ONLY', ru: 'ТОЛЬКО ТЕСТ' }, src: 'assets/audio/sfx/test-a.wav' };
      const samples = [fixture, { ...fixture, id: 'fixture-b', title: 'Test fixture B', src: 'assets/audio/sfx/test-b.wav' }, { ...fixture, id: 'missing', title: 'Unavailable fixture', src: 'assets/audio/sfx/missing.wav' }, { ...fixture, id: 'no-src', src: '' }];
      await route.fulfill({ response, body: (await response.text()) + `\nPORTFOLIO.sfx = ${JSON.stringify(samples)}; PORTFOLIO.tracks.find(track => track.id === 'original-sin-boss').src = 'assets/audio/sfx/test-music.wav';` });
    });
    await page.route('**/assets/audio/sfx/test-*.wav', route => {
      const bytes = fixtureWav();
      const range = route.request().headers().range?.match(/bytes=(\d+)-(\d*)/);
      if (range) {
        const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
        return route.fulfill({ status: 206, body: bytes.subarray(start, end + 1), contentType: 'audio/wav', headers: { 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${bytes.length}`, 'content-length': String(end - start + 1) } });
      }
      return route.fulfill({ body: bytes, contentType: 'audio/wav', headers: { 'accept-ranges': 'bytes', 'content-length': String(bytes.length) } });
    });
    await page.route('**/assets/audio/sfx/missing.wav', route => route.fulfill({ status: 404, body: '' }));
    await page.route('https://w.soundcloud.com/**', route => route.fulfill({ body: '<html><title>Test widget</title></html>', contentType: 'text/html' }));
    await page.goto(baseURL);
    const a = page.locator('[data-sample="fixture-a"]'), b = page.locator('[data-sample="fixture-b"]');
    assert.equal(await page.locator('#samples .sample').count(), 4, 'Configured files and empty slots are both visible');
    assert.equal(await page.locator('[data-sample="no-src"] button').isDisabled(), true);
    assert.equal(await page.locator('[data-sample="no-src"] audio').count(), 0, 'Pending slots make no audio request');
    await page.waitForFunction(() => [...document.querySelectorAll('audio')].filter(a => Number.isFinite(a.duration)).length === 3);
    assert.equal(await a.locator('audio').evaluate(a => a.duration), 6);
    assert.equal(await a.locator('audio').evaluate(a => a.paused), true, 'No autoplay');
    await a.locator('button').focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-sample="fixture-a"] audio').currentTime > .15);
    assert.equal(await a.locator('button').getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Space');
    assert.equal(await a.locator('audio').evaluate(a => a.paused), true);
    await a.locator('input').focus();
    await page.keyboard.press('End');
    assert.ok(await a.locator('audio').evaluate(a => a.currentTime) >= 5.9, 'Keyboard seeking');
    await page.keyboard.press('Home');
    await a.locator('button').click();
    await b.locator('button').click();
    await page.waitForFunction(() => !document.querySelector('[data-sample="fixture-b"] audio').paused);
    assert.equal(await a.locator('audio').evaluate(a => a.paused), true, 'Second sample pauses first');
    await b.locator('audio').evaluate(a => { a.currentTime = 5.8; });
    await page.waitForFunction(() => document.querySelector('[data-sample="fixture-b"] audio').ended);
    assert.equal(await b.locator('button').getAttribute('aria-pressed'), 'false', 'Ended resets control');
    await b.locator('button').click();
    await page.waitForFunction(() => document.querySelector('[data-sample="fixture-b"] audio').currentTime < 3);
    await page.locator('[data-lang=ru]').click();
    assert.match(await b.locator('button').getAttribute('aria-label'), /ПАУЗА/);
    assert.equal(await b.locator('audio').evaluate(a => a.paused), false, 'Language switch preserves playing audio');
    await page.locator('#track-original-sin-boss .sample-toggle').click();
    assert.equal(await b.locator('audio').evaluate(a => a.paused), true, 'Local music pauses SFX');
    await page.locator('.load-player').first().click();
    assert.equal(await page.locator('audio').evaluateAll(items => items.every(a => a.paused)), true, 'SoundCloud pauses local audio');
    await a.locator('button').click();
    assert.equal(await page.locator('.player-frame').count(), 0, 'Local audio closes external playback');
    // Fast switching must not revive a stale play promise.
    await page.evaluate(() => {
      document.querySelector('[data-sample="fixture-b"] button').click();
      document.querySelector('[data-sample="fixture-a"] button').click();
      document.querySelector('[data-sample="fixture-b"] button').click();
    });
    await page.waitForTimeout(200);
    assert.equal(await page.locator('audio').evaluateAll(items => items.filter(a => !a.paused).length), 1);
    const missing = page.locator('[data-sample="missing"]');
    await missing.locator('button').click();
    await page.waitForFunction(() => document.querySelector('[data-sample="missing"]').classList.contains('has-error'));
    assert.equal(await missing.locator('input').isDisabled(), true);
    assert.match(await missing.locator('.sample-status').textContent(), /Не удалось/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log('PASS real HTMLMediaElement: metadata, play/pause, keyboard seek, progress, end/replay, single playback, rapid switching, translation, missing-file recovery');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
