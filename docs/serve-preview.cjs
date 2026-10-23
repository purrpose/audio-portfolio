// Local static preview with byte ranges for real WAV/MP3 seeking. No dependencies.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.webm': 'video/webm' };
http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  let file;
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    file = fs.realpathSync(file);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (!fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  } catch { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  let start = 0, end = size - 1, status = 200;
  const headers = { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'accept-ranges': 'bytes', 'cache-control': 'no-store' };
  if (req.headers.range) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (!range || (!range[1] && !range[2])) { res.writeHead(416, { 'content-range': `bytes */${size}` }).end(); return; }
    start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) { res.writeHead(416, { 'content-range': `bytes */${size}` }).end(); return; }
    status = 206;
    headers['content-range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['content-length'] = Math.max(0, end - start + 1);
  res.writeHead(status, headers);
  if (req.method === 'HEAD' || size === 0) { res.end(); return; }
  const stream = fs.createReadStream(file, { start, end });
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
