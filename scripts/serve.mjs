#!/usr/bin/env node
/**
 * Server statis kecil untuk `npm run dev` + play-test lokal + CI smoke.
 * Situs ini murni statis (tanpa build): root repo langsung disajikan.
 * Resolusi ala Cloudflare Pages: path tanpa ekstensi -> `<path>.html`,
 * `/` -> `index.html`.
 *
 * Usage: PORT=8329 node scripts/serve.mjs [dir=.]
 */
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT ?? 8329);
const ROOT = resolve(process.argv[2] ?? ".");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  let file = join(ROOT, path);
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const html = `${file.replace(/\/$/, "")}.html`;
    if (existsSync(html) && statSync(html).isFile()) file = html;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found\n");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`));
