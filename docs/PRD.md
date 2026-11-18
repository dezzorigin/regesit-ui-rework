# PRD — Regesit UI Rework v1.1.0

## 1. Produk

Regesit adalah platform registrasi event & QR check-in. Repo ini berisi
**rework UI statis multi-halaman**-nya: lima halaman HTML yang saling
terhubung dan bisa dipakai sebagai demo produk end-to-end — dari membuat
event sampai check-in di pintu masuk. Tidak ada backend; semua state demo
disimpan di browser (`localStorage`).

Produk live (di luar repo ini): https://www.regesit.com

## 2. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Organizer event | Buat event, kelola pendaftaran, pantau kehadiran, ekspor data peserta |
| Peserta | Daftar lewat link, terima tiket QR, tunjukkan di pintu masuk |
| Panitia gate | Scan QR tiket, verifikasi instan, lihat feed check-in |

## 3. Fitur per halaman

### 3.1 Landing (`index.html`)
- Navbar (About, Events, Platform, Contacts) + tautan GitHub ke repo ini.
- Hero: judul animasi scramble, visual still-life, CTA "Buka Dashboard" dan
  "Buat Event Gratis" + catatan bahwa ini demo tanpa akun.
- Statement, bento event unggulan (tombol tiap kartu → pendaftaran),
  layanan interaktif (hover preview), timeline, metrik animasi (304 event,
  rating 4.9), footer + newsletter (konfirmasi inline).
- Seksi "Coba Produk": 4 kartu ke dashboard, wizard, pendaftaran, scanner.

### 3.2 Dashboard organizer (`dashboard.html`)
- Modul Central / Analytic / Kalender (ganti lewat sidebar).
- Central: statistik ringkas, tabel event (cari + ganti tampilan tabel/kartu),
  tombol buat event (modal wizard), tombol buka scanner.
- Modal detail event 4 tab: Link & QR pendaftaran, Edit, Peserta (+ ekspor
  CSV), Scanner panitia. QR di kedua tab dibuat lokal.
- Analytic: ringkasan statistik (statis, dari data contoh).
- Kalender: grid Agustus 2026 + navigasi bulan, daftar agenda.

### 3.3 Wizard buat event (`create-event.html` + modal di dashboard)
- 4 langkah: (1) format + info dasar, (2) waktu & lokasi, (3) kuota & tiket
  + add-on, (4) formulir peserta (field bawaan + template cepat).
- Validasi per langkah (nama wajib, waktu mulai + lokasi wajib).
- Publish: event tersimpan ke `localStorage` dan tampil di dashboard.

### 3.4 Pendaftaran peserta (`register.html`)
- Kartu event Tech Summit Indonesia 2026 (banner, tanggal, lokasi, deskripsi).
- Form: nama, email, nomor WhatsApp, institusi, tanda tangan digital
  (kanvas), persetujuan. Validasi real-time + toast + shake.
- Sukses: tiket QR (dibuat lokal) + kode `TIK-XXXX`, confetti, lightbox
  fullscreen, unduh file QR.

### 3.5 Gate scanner (`scanner.html`)
- Viewfinder: kamera asli bila diizinkan, sonst kanvas simulasi animasi.
- Klik viewfinder = simulasi scan sukses: bunyi beep, kartu verifikasi +
  stempel, counter naik, feed bertambah.
- Check-in manual (kode `TIK-...` atau nama), mode auto-scan, standby.

## 4. Batasan (non-goal, jujur)

- **Tanpa backend**: tidak ada akun, pembayaran, email, atau database.
  Semua "publish" dan "daftar" hanya mengubah state lokal.
- **Data contoh**: 4 event + 4 peserta di dashboard dan 5 peserta simulasi
  di scanner adalah data hardcode untuk demo.
- **QR bukan tiket terverifikasi server**: QR berisi `KODE|Nama|Email` —
  scanner demo tidak memvalidasi terhadap database mana pun.
- **Gambar AI-generated**: aset di `Assets/` adalah gambar pengganti yang
  dibuat ulang 2026-11-19 karena aset asli tidak pernah ter-commit
  (`.gitignore` lama meng-ignore seluruh `Assets/`).
- **Kontak footer** (email, telepon, alamat, NPWP) adalah data contoh
  dari desain asli, bukan kontak operasional yang terverifikasi.

## 5. Kriteria selesai (v1.1.0)

- 5 halaman lolos `html-validate` + `check-links`, 0 dependensi produksi
  (sweep OSV bersih), 5 tes Playwright hijau, deploy live 200, play-test
  live lolos.
