# Arsitektur

## 1. Gambaran

Situs **statis murni**: file HTML/CSS/JS disajikan apa adanya, tanpa build
step, tanpa bundler, tanpa framework, tanpa server. Satu-satunya "runtime"
adalah browser + `localStorage`.

```
Browser ──GET──> Cloudflare Pages (file statis)
   │
   ├─ Google Fonts (DM Sans, Inter) — CDN, dekoratif (fallback sans-serif)
   ├─ images.unsplash.com — 1 avatar contoh di dashboard (ada fallback cache
   │   lokal saat screenshot; bila gagal, <img> rusak tanpa memblokir halaman)
   └─ localStorage — state demo (event buatan pengguna, email newsletter)
```

Diagram visual: [diagrams.html](diagrams.html).

## 2. Peta file

| Jalur | Peran |
|---|---|
| `index.html` | Landing |
| `dashboard.html` | Dashboard organizer + modal wizard + modal detail |
| `create-event.html` | Wizard buat event (halaman penuh) |
| `register.html` | Pendaftaran peserta + tiket |
| `scanner.html` | Gate scanner |
| `css/*.css` | Satu stylesheet per halaman (pola penulis asli) |
| `js/main.js` | Landing: scramble, nav mobile, hover layanan, counter, carousel, newsletter |
| `js/dashboard.js` | Dashboard: modul, tabel/kartu, wizard modal, date-picker, kalender, detail modal, CSV |
| `js/create-event.js` | Wizard halaman penuh (4 langkah + publish ke store) |
| `js/register.js` | Form + tanda tangan + confetti + tiket QR lokal |
| `js/scanner.js` | Kamera/simulasi, scan, feed, standby |
| `js/store.js` | **Baru 1.1.0**: localStorage event + `escapeHtml` |
| `js/qr.js` | **Baru 1.1.0**: helper QR lokal |
| `js/vendor/qrcode.min.js` | qrcode-generator 1.4.4 (MIT), vendored dari cdnjs |
| `Assets/` | Gambar JPG (landing, banner, feed scanner) |
| `Documentation/` | Situs docs hand-off FE→BE asli (arsip, bukan spesifikasi aktif) |

## 3. Dependensi

| Jenis | Isi |
|---|---|
| Produksi (runtime) | **Tidak ada.** Nol paket npm di production tree (sweep OSV: 0 paket). |
| Dev | `@playwright/test`, `html-validate`, `wrangler` (lihat `package.json`) |
| Vendored | `qrcode-generator` 1.4.4 (MIT, `js/vendor/`) — satu-satunya lib JS |
| CDN (opsional) | Google Fonts; Unsplash (1 gambar). Keduanya dekoratif. |

## 4. Alur data

- **Buat event** → wizard (halaman/modal) → `RegesitStore.add()` →
  `localStorage[regesit.events.v1]` → dashboard render saat load
  (`initStoredEvents()`), terbaru di atas.
- **Daftar** → form → validasi → QR lokal (`RegesitQR.dataUrl`) → tiket.
- **Scan** → klik viewfinder / input manual → update DOM + counter
  (state in-memory saja, reset saat reload).
- **Newsletter** → email disimpan di `localStorage[regesit.newsletter]`.

## 5. Keamanan (seadanya, sesuai skala demo)

- Tidak ada secret di repo (dicek `check-links.mjs` tiap CI).
- Input pengguna yang dirender dashboard di-escape (`escapeHtml`) —
  sebelumnya disisip mentah ke `innerHTML`.
- Tidak ada `eval`, tidak ada `innerHTML` dari sumber luar.
- Catatan: ini demo front-end; tidak ada autentikasi/otorisasi sama sekali.
  Jangan pakai pola ini untuk data produksi tanpa backend + validasi server.
