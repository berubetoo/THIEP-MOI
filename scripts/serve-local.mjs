import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const requestedPort = process.argv.find(value => value.startsWith('--port='))?.slice(7) ?? '5500';
const port = Number(requestedPort);
if (!/^\d+$/.test(requestedPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Cong khong hop le. Vi du: npm start -- --port=5501');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
};

function reply(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return reply(response, 405, 'Method not allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(request.url.split('?')[0]);
  } catch {
    return reply(response, 400, 'Invalid URL');
  }
  if (pathname === '/') pathname = '/index.html';
  if (pathname !== '/index.html' && !pathname.startsWith('/assets/')) {
    return reply(response, 404, 'Not found');
  }
  const segments = pathname.split('/');
  if (pathname.includes('\\') || pathname.includes('\0') || segments.some(segment => segment === '.' || segment === '..')) {
    return reply(response, 403, 'Forbidden');
  }

  const filename = path.resolve(projectRoot, `.${pathname}`);
  const relative = path.relative(projectRoot, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return reply(response, 403, 'Forbidden');
  }

  try {
    const info = await fs.promises.stat(filename);
    if (!info.isFile()) return reply(response, 404, 'Not found');
    response.setHeader('Content-Type', mimeTypes[path.extname(filename)] ?? 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Accept-Ranges', 'bytes');

    let start = 0;
    let end = info.size - 1;
    let status = 200;
    if (request.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!range || (!range[1] && !range[2])) {
        response.setHeader('Content-Range', `bytes */${info.size}`);
        return reply(response, 416, 'Range not satisfiable');
      }
      if (!range[1]) {
        start = Math.max(0, info.size - Number(range[2]));
      } else {
        start = Number(range[1]);
        if (range[2]) end = Math.min(end, Number(range[2]));
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= info.size) {
        response.setHeader('Content-Range', `bytes */${info.size}`);
        return reply(response, 416, 'Range not satisfiable');
      }
      status = 206;
      response.setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`);
    }
    response.writeHead(status, { 'Content-Length': end - start + 1 });
    if (request.method === 'HEAD') return response.end();
    const stream = fs.createReadStream(filename, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    reply(response, ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, 'File unavailable');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Cong ${port} dang duoc su dung. Chay: npm start -- --port=${port + 1}`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Thiep cuoi local: http://localhost:${port}`);
  console.log('Chi phuc vu tren may nay (127.0.0.1). Nhan Ctrl+C de dung.');
});
