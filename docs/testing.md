# Testing

## 1. Perintah

```bash
npm run validate   # check-links + html-validate (5 halaman)
npm test           # Playwright e2e, 5 tes (butuh Chromium)
npm run sweep      # OSV advisory sweep
npm run screenshots  # hasilkan ulang docs/screenshots/*.png (butuh server
                   # lokal + Chromium cache + forwarder 127.0.0.1:18081)
npm run make-video   # rangkai screenshot jadi docs/demo/demo.mp4
```

## 2. Yang diuji e2e (`e2e/smoke.spec.js`)

| # | Tes | Yang dibuktikan |
|---|---|---|
| 1 | Landing | Judul, tautan GitHub, CTA hero, seksi demo (4 kartu), newsletter inline |
| 2 | Wizard buat event | Validasi menahan langkah kosong; publish → tampil di dashboard; tahan reload |
| 3 | Dashboard | Filter cari, ganti tampilan, modal detail (QR lokal), ekspor CSV mengunduh file |
| 4 | Pendaftaran | Validasi menahan form kosong; submit → tiket QR lokal (data URL) + lightbox |
| 5 | Scanner | Klik viewfinder → check-in + counter naik; manual check-in; standby |

Setiap tes juga meng-assert **nol console error/pageerror + nol request
lokal 404** (via `afterEach` + listener `response`).

## 3. CI (`.github/workflows/ci.yml`)

| Job | Isi |
|---|---|
| `static-checks` | Node 24, `npm ci`, `check-links.mjs`, `html-validate` 5 halaman, smoke server (5 halaman + CSS/JS/vendor/QR + 3 gambar inti harus 200) |
| `advisory-sweep` | Python 3.12, `scripts/advisory-sweep.py` (OSV batch, tanpa auth) |
| `playwright-e2e` | Node 24, `npm ci`, `npx playwright install --with-deps chromium`, `npm test` |

## 4. Pengecualian yang didokumentasikan (bukan pelonggaran diam-diam)

- **`no-inline-style: off`** — situs memakai inline style secara pervasif
  sejak awal (pola penulis asli); memindahkannya berarti rewrite 5 halaman.
- **`wcag/h32: off`** — wizard sengaja button-driven (Next/Publish
  `type="button"` + handler JS). Tombol submit native akan membuat Enter
  di langkah awal mem-publish event yang belum lengkap, melewati validasi
  bertahap wizard.
- **Sweep 0 paket produksi** — situs statis; semua dependensi npm adalah
  devDependencies. Skrip sweep tetap dijaga sebagai gate bila suatu saat
  ada dependensi runtime (HIGH/CRITICAL = gagal).

## 5. Gate anti-slop & mobile (docs/DESIGN.md)

- **Gate slop di CI** — `scripts/check-links.mjs` §7 menolak: emoji mentah
  sebagai ikon fungsi (kecuali glif teks ✓/✕/✦), gradient ungu/biru
  (hijau sukses dibolehkan), impor font Inter.
- **Mobile 390px** — 5 halaman dicek headless (390×844): tanpa overflow
  horizontal (`scrollWidth == 390` di semua halaman; tabel dashboard
  menggulir di dalam kontainernya sendiri, bukan halaman), target sentuh
  ≥ 44px (0 temuan setelah perbaikan), grid demo 1 kolom, sticky CTA bar
  tampil. Bukti: `docs/screenshots/11-landing-mobile-390.png`,
  `12-dashboard-mobile-390.png`.
- **Motion & a11y** — transisi interaksi ≤ 180ms ease-out, `:active`
  scale 0.97, `prefers-reduced-motion` mematikan animasi/transisi,
  `:focus-visible` di semua halaman, angka data `tabular-nums`.
- **Tes siluet** — `docs/screenshots/13-silhouette.png` (grayscale 320px):
  masih terbaca sebagai platform event (display type raksasa + foto event +
  bento), bukan SaaS generik.

## 6. Catatan tooling lokal
- **Jangan** jalankan `npx playwright install chromium` di VM ini — itu
  menghapus isi `~/.cache/ms-playwright/` (chromium-1234 milik tooling
  lain). Jalankan tes dengan
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=$HOME/.cache/ms-playwright/chromium-1234/chrome-linux/chrome npm test`.
- Screenshot memakai forwarder `127.0.0.1:18081` (harus hidup) + Chromium
  cache; gambar Unsplash di-cache via curl ke `scripts/.imgcache/`.
- Jangan pakai `curl | grep -q` + `pipefail` di smoke step: `grep -q`
  menutup pipe begitu cocok dan curl mati SIGPIPE (exit 23). Pola benar:
  `curl -o file` lalu `grep` file (lihat workflow).
