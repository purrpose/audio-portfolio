// Verify the original credits, public destinations and real image files survive.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'source-inventory.json'), 'utf8'));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'portfolio-data.js'), 'utf8'), sandbox);
const data = JSON.parse(JSON.stringify(sandbox.window.PORTFOLIO));
assert.equal(data.showreelUrl, baseline.showreelUrl);
assert.deepEqual(data.contacts, baseline.contacts);
for (const project of baseline.projects) for (const key of Object.keys(project)) assert.equal(data.projects.find(p => p.id === project.id)[key], project[key]);
for (const track of baseline.tracks) for (const key of Object.keys(track)) assert.equal(data.tracks.find(t => t.id === track.id)[key], track[key]);
for (const { file, sha256 } of baseline.images) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex'), sha256, file);
const banned = new RegExp('rob' + 'lox', 'i');
function checkDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) checkDirectory(file);
    else if (/\.(html|css|js|cjs|json|md|txt|svg)$/i.test(file)) assert.equal(banned.test(fs.readFileSync(file, 'utf8')), false, file);
  }
}
checkDirectory(root);
const sampleIds = new Set();
for (const sample of data.sfx) {
  assert.match(sample.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'SFX ID must be a nonempty slug');
  assert.ok(!sampleIds.has(sample.id), `Duplicate SFX ID: ${sample.id}`);
  sampleIds.add(sample.id);
  assert.ok(sample.title && sample.category.en && sample.category.ru, `Missing SFX copy: ${sample.id}`);
  if (!sample.src) continue;
  assert.ok(!/[\\\x00-\x1f]/.test(sample.src), `Use forward slashes in src: ${sample.id}`);
  assert.ok(sample.src.startsWith('assets/audio/sfx/'), `Unexpected SFX path: ${sample.id}`);
  assert.ok(fs.statSync(path.join(root, sample.src)).isFile(), `Missing SFX file: ${sample.src}`);
}
console.log('PASS original links, contacts, credits, artwork hashes, SFX IDs/files and text scan');
