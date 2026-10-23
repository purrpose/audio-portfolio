// Read-only destination audit. Does not upload files or send contact messages.
const { chromium } = require('./browser-helper.cjs');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../portfolio-data.js'), 'utf8'), sandbox);
const data = sandbox.window.PORTFOLIO;
const urls = [...new Set([data.showreelUrl, ...Object.values(data.contacts), ...data.projects.map(p => p.url), ...data.tracks.map(t => t.url)].filter(u => /^https?:/.test(u)))];
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext();
    const results = await Promise.all(urls.map(async url => {
      try {
        const response = await context.request.get(url, { timeout: 25000 });
        const body = await response.text();
        return { url, status: response.status(), destination: response.url(), title: body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '', verified: response.ok() };
      } catch (error) { return { url, verified: false, error: error.message.split('\n')[0] }; }
    }));
    // Browser navigation can succeed when the request transport is blocked.
    for (const row of results.filter(row => !row.verified)) {
      const page = await context.newPage();
      await page.route(/\.(png|jpe?g|webp|gif|woff2?)(\?|$)/i, route => route.abort());
      try {
        const response = await page.goto(row.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        row.browserStatus = response?.status();
        row.browserTitle = await page.title();
        row.verified = Boolean(response?.ok());
      } catch (error) { row.browserError = error.message.split('\n')[0]; }
      await page.close();
    }
    results.forEach(row => console.log(JSON.stringify(row)));
    console.log('Email syntax:', /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contacts.email));
    console.log('Discord username preserved:', data.contacts.discord);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
