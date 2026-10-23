// Optional network integration check. A blocked service is reported, not passed.
const { chromium, baseURL } = require('./browser-helper.cjs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: Number(process.env.VIEWPORT_WIDTH) || 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(baseURL);
    const failures = [];
    page.on('requestfailed', request => { if (/youtube|soundcloud/.test(request.url())) failures.push({ url: request.url(), error: request.failure()?.errorText }); });
    if (!process.env.YOUTUBE_ONLY) await page.addScriptTag({ url: 'https://w.soundcloud.com/player/api.js' });
    async function waitPosition(minimum) {
      let position = 0;
      for (let attempt = 0; attempt < 50; attempt++) {
        position = await page.evaluate(() => new Promise(resolve => liveWidget.getPosition(resolve)));
        if (position >= minimum) return position;
        await page.waitForTimeout(250);
      }
      throw new Error(`Position remained ${position}ms; expected at least ${minimum}ms`);
    }
    let unavailable = 0;
    const trackCount = await page.locator('.load-player').count();
    for (let i = Number(process.env.TRACK_START) || 0; i < (process.env.YOUTUBE_ONLY ? 0 : trackCount); i++) {
      let stage = 'load';
      await page.locator('.load-player').nth(i).click();
      try {
        const play = page.frameLocator('.player-frame').locator('.playButton').first();
        await play.waitFor({ state: 'visible', timeout: 12000 });
        await page.evaluate(() => { window.liveWidget = SC.Widget(document.querySelector('.player-frame')); });
        console.log('Live recording:', await page.evaluate(() => new Promise(resolve => liveWidget.getCurrentSound(sound => resolve({ title: sound.title, url: sound.permalink_url, duration: sound.duration })))));
        stage = 'play/progress';
        await play.click();
        console.log('Playback position (ms):', await waitPosition(1000));
        assert.equal(await page.evaluate(() => new Promise(resolve => liveWidget.isPaused(resolve))), false);
        await play.click();
        stage = 'pause';
        await page.waitForTimeout(200);
        assert.equal(await page.evaluate(() => new Promise(resolve => liveWidget.isPaused(resolve))), true);
        await page.evaluate(() => liveWidget.seekTo(10000));
        stage = 'seek';
        console.log('Seek position (ms):', await waitPosition(9500));
        console.log(`PASS live SoundCloud track ${i + 1}: play, pause, progress, seek`);
      } catch (error) { unavailable++; console.log(`UNVERIFIED live SoundCloud track ${i + 1} (${stage}): ${error.message.split('\n')[0]}`); }
    }
    await page.locator('#showreel-content button').click();
    try {
      const frame = page.frameLocator('#showreel-content iframe');
      const video = frame.locator('video');
      await video.waitFor({ state: 'attached', timeout: 25000 });
      let state;
      for (let attempt = 0; attempt < 50; attempt++) {
        state = await video.evaluate(v => ({ paused: v.paused, time: v.currentTime, duration: v.duration, ready: v.readyState }));
        if (!state.paused && state.time > 1 && state.ready >= 3) break;
        await page.waitForTimeout(250);
      }
      assert.equal(state.paused, false);
      assert.ok(state.time > 1);
      assert.ok(state.duration > 0);
      console.log('PASS live YouTube playback:', state);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Live embed has no horizontal overflow');
      await frame.getByRole('button', { name: /Приостановить видео|Pause/ }).first().click({ timeout: 5000 });
      await page.waitForTimeout(200);
      assert.equal(await video.evaluate(v => v.paused), true);
      await frame.getByRole('button', { name: /Воспроизвести видео|Play/ }).first().click({ timeout: 5000 });
      await page.waitForTimeout(200);
      assert.equal(await video.evaluate(v => v.paused), false);
      console.log('PASS live YouTube pause and resume');
    } catch (error) {
      unavailable++; console.log(`UNVERIFIED live YouTube reel: ${error.message.split('\n')[0]}`);
      const actualFrame = page.frames().find(f => f.url().includes('youtube-nocookie'));
      if (actualFrame) console.log('YouTube page:', (await actualFrame.locator('body').innerText({ timeout: 1500 }).catch(() => 'unavailable')).slice(0, 600));
    }
    if (unavailable) process.exitCode = 2;
    console.log('Failed media requests:', JSON.stringify(failures.filter(f => /youtube-nocookie|player\//.test(f.url))));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
