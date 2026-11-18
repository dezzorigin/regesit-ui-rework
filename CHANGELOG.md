# Changelog

Semua perubahan penting proyek ini dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-19 — Proper rework (P1 #30)

### Ditambahkan
- LICENSE MIT (repo ini sebelumnya tanpa lisensi).
- 12 gambar `Assets/` (hero, bento, timeline, avatar, banner, feed scanner)
  sebagai pengganti aset asli yang hilang — lihat "Diperbaiki".
- Seksi "Coba Produk" di landing + CTA hero ke dashboard/wizard + tautan
  GitHub di navbar (desktop & mobile).
- `js/store.js`: event buatan pengguna tersimpan di `localStorage`
  (`regesit.events.v1`) dan muncul di dashboard setelah pindah halaman/reload.
- `js/qr.js` + `js/vendor/qrcode.min.js` (qrcode-generator 1.4.4, MIT): QR
  tiket & QR modal detail dibuat lokal di browser.
- `favicon.svg` + `<link rel="icon">` di 5 halaman (sebelumnya 404).
- CI (`.github/workflows/ci.yml`, 3 job): static-checks (Node 24),
  advisory-sweep (OSV batch, tanpa auth), playwright-e2e.
- `package.json` (dev tooling saja) + `package-lock.json`, `wrangler.toml`,
  `.htmlvalidate.json`, `scripts/` (serve, check-links, screenshot,
  make-video, advisory-sweep), `e2e/smoke.spec.js` (5 tes alur penuh).
- `docs/` lengkap: PRD, arsitektur, halaman, data, desain, testing, deploy,
  diagram HTML+SVG (`diagrams.html`), 10 screenshot, video demo 50 detik.
- Ekspor CSV peserta yang benar-benar mengunduh file (dari tabel peserta).

### Diperbaiki
- **Semua gambar landing 404**: `.gitignore` lama meng-ignore seluruh
  folder `Assets/`, sehingga aset tidak pernah ter-commit. `.gitignore`
  diperbaiki (hanya `*.psd` yang di-ignore) dan gambar dibuat ulang.
- **QR bergantung ke `api.qrserver.com`**: tiket & QR modal detail kini
  dibuat lokal; tidak ada lagi request QR ke layanan luar.
- **Event hasil wizard hilang**: wizard buat event hanya `alert()` lalu
  redirect — event tidak tersimpan. Kini tersimpan dan tampil di dashboard.
- **Tombol "Unduh Tiket" palsu**: sebelumnya hanya toast tanpa file.
  Kini benar-benar mengunduh file QR tiket.
- **Viewfinder scanner tidak pernah tampil**: kanvas simulasi digambar tapi
  `display` tetap `none` dan tertutup foto feed. Kini kanvas ditampilkan
  saat kamera tidak tersedia.
- **Dua `</div>` stray di `dashboard.html`** (modul kalender) + anchor
  sidebar `#central/#analytics/#calendar` yang tidak punya target +
  `<div>` langsung di bawah `<ul>` + tombol tanpa `type` + tombol ikon
  tanpa `aria-label` + `autoplay` di `<video>` scanner (kini `play()`
  eksplisit) — semuanya diperbaiki sampai `html-validate` bersih.
- **Newsletter `alert()` native** di footer: kini konfirmasi inline
  (email dicatat lokal saja, tidak dikirim ke mana pun).
- **Nilai input pengguna disisip mentah ke `innerHTML`** di dashboard
  (publish wizard): kini di-escape lewat `RegesitStore.escapeHtml`.
- **Kontras tautan GitHub di navbar**: teks putih di atas pill terang
  tidak terbaca — kini gelap.
- `shot_full.png` (screenshot basi, judul masih ter-scramble) dihapus,
  diganti `docs/screenshots/*.png` yang baru.

### Dikoreksi (klaim lama yang tidak benar)
- `CHANGELOG.md` lama mengklaim setup Next.js, Supabase, dan RLS —
  repo ini murni HTML/CSS/JS statis; klaim tersebut dihapus.
- `README.md` lama mengklaim `npm install` + `npm run dev` padahal
  tidak ada `package.json` — kini cara jalan sudah terverifikasi.

## [1.0.0] - 2024-11-05

### Ditambahkan
- Impor awal: landing multi-seksi, dashboard organizer, wizard buat event
  4 langkah, pendaftaran peserta + tanda tangan digital, gate scanner.
- README template, `.gitignore`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`,
  folder `Documentation/` (situs docs hand-off FE→BE).
