// Screenshot dokumentasi: adegan 5 halaman situs yang sedang berjalan
// (server lokal) ke docs/screenshots/*.png — dipakai README + video demo.
//
// Gambar eksternal (avatar Unsplash di dashboard) di-cache via curl ke
// scripts/.imgcache/ lalu disajikan lewat request interception — polanya
// sama seperti repo #29: CONNECT langsung lewat forwarder VM ini ke host
// gambar kadang menggantung, sementara curl langsung 200. Google Fonts
// dibiarkan lewat forwarder (terverifikasi 200); bila gagal, halaman
// memakai fallback sans-serif dan screenshot tetap valid.
//
// Prasyarat: puppeteer-core (node_modules), Chromium di cache
// (~/.cache/ms-playwright/chromium-1234), forwarder 127.0.0.1:18081 hidup,
// dan server lokal di PORT (default 8329 — jalankan `npm run dev` dulu).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts', '.imgcache');
const OUT = join(ROOT, 'docs', 'screenshots');
const PORT = process.env.PORT || '8329';
const BASE = `http://127.0.0.1:${PORT}`;

const require = createRequire(import.meta.url);
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch {
  try {
    puppeteer = require('/home/hatch/workspace/absensirapat-audit/diag/node_modules/puppeteer-core');
  } catch {
    console.error('puppeteer-core tidak ditemukan. Pasang dulu: npm i -D puppeteer-core, atau sediakan di ~/workspace/absensirapat-audit/diag/node_modules.');
    process.exit(1);
  }
}

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

// Kumpulkan URL gambar eksternal dari HTML (saat ini: avatar Unsplash).
const sources = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html'))
  .map((f) => readFileSync(join(ROOT, f), 'utf-8'))
  .join('\n');
const urls = [...new Set([...sources.matchAll(/https:\/\/(?:images\.unsplash\.com)[^"'\\\s)]+/g)].map((m) => m[0]))];
console.log(`${urls.length} gambar eksternal ditemukan`);

const byUrl = new Map();
for (const url of urls) {
  const key = createHash('sha1').update(url).digest('hex').slice(0, 16);
  const file = join(CACHE, `${key}.jpg`);
  if (!existsSync(file) || readFileSync(file).length < 1000) {
    try {
      execFileSync('curl', ['-sL', '--max-time', '30', '-o', file, url], { stdio: 'ignore' });
    } catch { /* biarkan gagal — halaman tetap jalan tanpa avatar */ }
  }
  if (existsSync(file) && readFileSync(file).length >= 1000) byUrl.set(url, file);
}
console.log(`${byUrl.size}/${urls.length} gambar ter-cache`);

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || join(process.env.HOME, '.cache/ms-playwright/chromium-1234/chrome-linux/chrome');
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: 'new',
  args: ['--proxy-server=http://127.0.0.1:18081', '--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on('request', (req) => {
  const url = req.url();
  if (byUrl.has(url)) {
    req.respond({ status: 200, contentType: 'image/jpeg', body: readFileSync(byUrl.get(url)) });
  } else {
    req.continue();
  }
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: join(OUT, name) });
const scrollTo = async (sel) => {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -70);
  }, sel);
  await sleep(1400);
};

// ── 1-3. Landing ────────────────────────────────────────────────────────
await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.hero-title', { timeout: 15000 });
await sleep(3500); // animasi scramble judul selesai + gambar hero termuat
await shot('01-landing-hero.png');
await scrollTo('#featured');
await shot('02-landing-events.png');
await scrollTo('#demo');
await shot('03-landing-demo.png');

// ── 4-5. Dashboard ──────────────────────────────────────────────────────
await page.goto(`${BASE}/dashboard.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#eventManagementTable', { timeout: 15000 });
await sleep(1500);
await shot('04-dashboard.png');
// Modal wizard buat event dari dashboard.
await page.click('.btn-trigger-create-wizard');
await page.waitForSelector('#createEventModalOverlay.active', { timeout: 10000 });
await sleep(1000);
await shot('05-dashboard-create-modal.png');
await page.keyboard.press('Escape');
await sleep(500);

// ── 6. Wizard buat event (halaman sendiri) ──────────────────────────────
await page.goto(`${BASE}/create-event.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#createEventWizardForm', { timeout: 15000 });
await sleep(1000);
await shot('06-create-event.png');

// ── 7-8. Pendaftaran peserta -> tiket QR ────────────────────────────────
await page.goto(`${BASE}/register.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#participantRegisterForm', { timeout: 15000 });
await sleep(1000);
await shot('07-register.png');
// Isi form + tanda tangan + submit sampai tiket tampil.
await page.type('#regFullName', 'Tamu Uji Coba');
await page.type('#regEmail', 'tamu@uji.id');
await page.type('#regPhone', '081234567890');
await page.type('#regCompany', 'PT Uji Coba');
await page.evaluate(() => document.querySelector('#signatureCanvas')?.scrollIntoView({ block: 'center' }));
await sleep(600);
const sig = await (await page.$('#signatureCanvas')).boundingBox();
await page.mouse.move(sig.x + 40, sig.y + 60);
await page.mouse.down();
for (let i = 0; i <= 10; i++) {
  await page.mouse.move(sig.x + 40 + i * 18, sig.y + 60 - Math.sin(i) * 12, { steps: 2 });
}
await page.mouse.up();
await page.click('#regAgreement');
await page.click('#btnSubmitForm');
await page.waitForSelector('#ticketSuccessView.active', { timeout: 10000 });
await sleep(1500);
await shot('08-register-ticket.png');

// ── 9-10. Gate scanner ──────────────────────────────────────────────────
await page.goto(`${BASE}/scanner.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('#viewfinderCard', { timeout: 15000 });
await sleep(1200);
await shot('09-scanner.png');
await page.click('#viewfinderCard');
await sleep(1000);
await shot('10-scanner-scan.png');

await browser.close();
console.log('screenshots:', readdirSync(OUT).filter((f) => f.endsWith('.png')).join(', '));
