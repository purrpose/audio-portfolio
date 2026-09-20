const { chromium } = require(process.env.TEMP + '/portfolio-browser-check/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:4173');
  await page.locator('.load-player').first().click();
  await page.addScriptTag({ url: 'https://w.soundcloud.com/player/api.js' });
  const sounds = await page.evaluate(() => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('SoundCloud readiness timeout')), 20000);
    window.audioCheck = SC.Widget(document.querySelector('.player-frame'));
    audioCheck.bind(SC.Widget.Events.READY, () => audioCheck.getSounds(sounds => {
      clearTimeout(timer);
      resolve(sounds.map(({title, permalink_url, duration}) => ({title, permalink_url, duration})));
    }));
  }));
  console.log('TRACKS', JSON.stringify(sounds));
  assert.equal(await page.evaluate(() => new Promise(r => audioCheck.isPaused(r))), true, 'No autoplay');
  const frame = page.frames().find(f => f.url().includes('w.soundcloud.com'));
  console.log('CONTROLS', await frame.locator('button').evaluateAll(nodes => nodes.map(n => ({text:n.textContent, label:n.getAttribute('aria-label'),title:n.title,classes:n.className}))));
  const play = frame.locator('.playButton').first();
  await play.click();
  await page.waitForTimeout(2500);
  assert.equal(await page.evaluate(() => new Promise(r => audioCheck.isPaused(r))), false, 'Play works');
  assert.ok(await page.evaluate(() => new Promise(r => audioCheck.getPosition(r))) > 0, 'Playback advances');
  await play.click();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => new Promise(r => audioCheck.isPaused(r))), true, 'Pause works');
  await page.evaluate(() => audioCheck.seekTo(30000));
  await page.waitForTimeout(500);
  const position = await page.evaluate(() => new Promise(r => audioCheck.getPosition(r)));
  assert.ok(position >= 29000 && position <= 31000, 'Seeking works');
  console.log('PASS real mobile SoundCloud play, pause, seek and no autoplay');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
