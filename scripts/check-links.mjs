#!/usr/bin/env node
/**
 * Pemeriksaan statis situs (tanpa browser) — dipakai `npm run validate`
 * dan job `static-checks` di CI:
 *   1. Semua referensi lokal di 5 halaman HTML (src/href relatif) ada di disk.
 *   2. Semua anchor `#id` yang ditaut punya elemen ber-id tersebut.
 *   3. Semua referensi aset di js/*.js (string path relatif) ada di disk.
 *   4. Nama proyek konsisten (package.json == wrangler.toml == deploy script).
 *   5. Sapu secret kasar di file web: pola kredensial umum + artefak
 *      wrangler yang tidak boleh ke-commit.
 *   6. Tidak ada lagi pemakaian QR eksternal (api.qrserver.com/v1/) —
 *      QR wajib dibuat lokal (js/vendor/qrcode.min.js); URL ke layanan
 *      luar di komentar dokumentasi tidak dihitung, yang dicek adalah
 *      pemakaian sebagai src/fetch.
 *   7. Gate anti-slop P0 (docs/DESIGN.md): tanpa emoji mentah sebagai ikon
 *      fungsi, tanpa gradient ungu/biru, tanpa impor font Inter.
 * Keluar 1 bila ada satu saja temuan; semua temuan dicetak sekaligus.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (msg) => failures.push(msg);

const PAGES = ["index.html", "dashboard.html", "create-event.html", "register.html", "scanner.html"];
const JS_FILES = readdirSync(join(ROOT, "js")).filter((f) => f.endsWith(".js"))
  .map((f) => join("js", f));
JS_FILES.push("js/vendor/qrcode.min.js");

// ── 1+2. Referensi lokal & anchor per halaman ────────────────────────────
for (const page of PAGES) {
  const html = readFileSync(join(ROOT, page), "utf-8");
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) {
      if (ref.startsWith("#") && ref.length > 1 && !ids.has(decodeURIComponent(ref.slice(1)))) {
        fail(`${page}: anchor mati: ${ref} (tidak ada elemen id="${ref.slice(1)}")`);
      }
      continue;
    }
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    if (!existsSync(join(ROOT, decodeURIComponent(clean)))) fail(`${page}: file lokal hilang: ${ref}`);
  }
  // Gambar <img> wajib punya alt (aksesibilitas).
  for (const m of html.matchAll(/<img([^>]*)>/g)) {
    if (!/alt=/.test(m[1])) fail(`${page}: <img> tanpa alt: ${m[0].slice(0, 80)}...`);
  }
}

// ── 3. Referensi path relatif di JS (redirect / window.open / src) ───────
for (const rel of JS_FILES) {
  const js = readFileSync(join(ROOT, rel), "utf-8");
  for (const m of js.matchAll(/['"]([a-z0-9_./-]+\.(?:html|js|css|jpg|png))['"]/gi)) {
    const target = m[1];
    if (target.startsWith("http") || target.startsWith("data:")) continue;
    if (!existsSync(join(ROOT, target))) fail(`${rel}: path lokal hilang: ${target}`);
  }
}

// ── 4. Nama proyek konsisten ─────────────────────────────────────────────
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
const wrangler = readFileSync(join(ROOT, "wrangler.toml"), "utf-8");
const wname = (wrangler.match(/^name\s*=\s*"([^"]+)"/m) || [])[1];
if (pkg.name !== "regesit-ui-rework") fail(`package.json name bukan regesit-ui-rework: ${pkg.name}`);
if (wname !== "regesit-ui-rework") fail(`wrangler.toml name bukan regesit-ui-rework: ${wname}`);
if (!/--project-name=regesit-ui-rework/.test(pkg.scripts?.deploy || "")) {
  fail("script deploy tidak memakai --project-name=regesit-ui-rework");
}
if (!existsSync(join(ROOT, "js/vendor/qrcode.min.js"))) fail("js/vendor/qrcode.min.js hilang (QR lokal)");
if (!existsSync(join(ROOT, "LICENSE"))) fail("LICENSE hilang");

// ── 5. Sapu secret kasar (file web saja) ──────────────────────────────────
const SECRET_PATTERNS = [
  [/\.wrangler\//, "referensi .wrangler (artefak lokal, jangan ke-commit)"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\bghp_[A-Za-z0-9]{20,}\b/, "GitHub personal access token"],
  [/\bgho_[A-Za-z0-9]{20,}\b/, "GitHub OAuth token"],
  [/\bsk-[A-Za-z0-9]{20,}\b/, "API key pola sk-"],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, "Slack token"],
];
const SCAN_FILES = [...PAGES, ...JS_FILES, "package.json", "wrangler.toml"];
for (const rel of SCAN_FILES) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  for (const [re, label] of SECRET_PATTERNS) {
    if (re.test(content)) fail(`${rel}: temuan secret (${label})`);
  }
}
if (existsSync(join(ROOT, ".wrangler"))) fail("direktori .wrangler ada di tree (harus dihapus + di-.gitignore)");

// ── 6. QR eksternal tidak boleh dipakai sebagai src/fetch ─────────────────
for (const rel of SCAN_FILES) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  if (/api\.qrserver\.com\/v1\//.test(content)) {
    fail(`${rel}: masih memakai QR eksternal api.qrserver.com/v1/ (wajib QR lokal)`);
  }
}

// ── 7. Gate anti-slop P0 (docs/DESIGN.md) ────────────────────────────────
const CSS_FILES = readdirSync(join(ROOT, "css")).filter((f) => f.endsWith(".css"))
  .map((f) => join("css", f));
// 7a. Emoji mentah sebagai ikon fungsi — yang dibolehkan hanya glif teks
//     ✓ (centang), ✕ (tutup), ✦ (hiasan). Sisanya wajib SVG/teks polos.
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/gu;
const EMOJI_ALLOW = new Set(["✓", "✕", "✦"]);
for (const rel of [...PAGES, ...JS_FILES]) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  for (const m of content.matchAll(EMOJI_RE)) {
    if (!EMOJI_ALLOW.has(m[0])) fail(`${rel}: emoji mentah ${m[0]} (pakai SVG stroke 1.5-2px / teks polos)`);
  }
}
// 7b. Gradient ungu/biru — gradient hijau sukses (#3bc855/#22c55e) dibolehkan.
const BANNED_GRADIENT_TOKENS = [
  "#1d4ed8", "#1e40af", "#0056cc", "#60a5fa", "#7544ea",
  "117, 68, 234", "25, 117, 249", "var(--color-primary)",
];
for (const rel of [...PAGES, ...CSS_FILES]) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  for (const line of content.split("\n")) {
    if (!/gradient\(/.test(line)) continue;
    for (const tok of BANNED_GRADIENT_TOKENS) {
      if (line.includes(tok)) fail(`${rel}: gradient ungu/biru (${tok}): ${line.trim().slice(0, 90)}`);
    }
  }
}
// 7c. Font Inter dilarang (display = Space Grotesk, body = DM Sans).
for (const rel of [...PAGES, ...CSS_FILES]) {
  const content = readFileSync(join(ROOT, rel), "utf-8");
  if (/family=Inter/.test(content)) fail(`${rel}: masih mengimpor font Inter (pakai Space Grotesk)`);
}

if (failures.length > 0) {
  console.error(`\ncheck-links: ${failures.length} temuan:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("check-links: OK (referensi lokal, anchor, alt img, path JS, nama proyek, sapu secret, QR lokal, gate anti-slop)");
