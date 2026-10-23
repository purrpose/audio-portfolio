// Development-only dependency; never shipped to visitors.
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || path.join(process.env.LOCALAPPDATA, 'Temp/portfolio-browser-check/node_modules/playwright'));
const fs = require('node:fs');
const screenshots = path.join(process.env.LOCALAPPDATA, 'Temp/portfolio-browser-check/screenshots');
fs.mkdirSync(screenshots, { recursive: true });
module.exports = { chromium, screenshots, baseURL: process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173' };
