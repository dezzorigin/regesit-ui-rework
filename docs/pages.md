# Halaman & Alur

## 1. Peta navigasi

```
index.html (landing)
├── #demo ──► dashboard.html ──► create-event.html (wizard penuh)
│              │                 └── publish ──► dashboard.html?created=<id>
│              ├── modal wizard (di dashboard) ──► baris + kartu baru
│              ├── modal detail ──► tab Scanner ──► scanner.html (tab baru)
│              └── tombol scanner ──► scanner.html (tab baru)
├── register.html ──► tiket QR ──► (QR dipindai di scanner — simulasi)
└── scanner.html ──► kembali ──► dashboard.html
```

## 2. Landing (`index.html`)

- Hero title memakai efek scramble (huruf acak → "REGESIT") ±1 detik.
- Counter metrik (304 event, 4.9*) beranimasi saat section terlihat.
- Daftar layanan: hover menampilkan preview gambar + kursor kuning mengikuti.
- Timeline: carousel geser ±340px per klik.
- Bento event: tombol panah → `register.html`.
- Newsletter: submit → konfirmasi inline (tanpa `alert()`).
- Footer "START SELLING" → `create-event.html`.

## 3. Dashboard (`dashboard.html`)

- Sidebar: Central / Analytic / Kalender (`data-module`, `preventDefault`).
- Tabel event: 4 baris contoh; kolom pencarian memfilter nama;
  tombol tampilan beralih tabel ↔ kartu.
- Modal wizard ("Buat Event"): duplikasi wizard halaman penuh di dalam
  modal, dengan date-picker kustom (kalender + jam AM/PM) dan add-on toggle.
  Publish: simpan ke store + prepend baris/kartu + modal sukses + confetti.
- Modal detail (tombol Detail di baris/kartu/kalender): 4 tab.
  Tab Link menampilkan URL pendaftaran + QR (dibuat lokal dari URL event);
  tab Peserta menampilkan 4 peserta contoh + tombol ekspor CSV;
  tab Scanner menampilkan URL + QR scanner panitia.
- Kalender: label bulan bisa digeser (Agustus 2026 ±1 bulan), tag event
  di tanggal bisa diklik → modal detail.

## 4. Wizard buat event (`create-event.html`)

- Stepper 4 langkah; klik node langkah sebelumnya untuk kembali.
- Langkah 1: format (Offline/Online/Hybrid), banner (dropzone — tampilan
  saja, file tidak diunggah ke mana pun), nama (wajib), deskripsi.
- Langkah 2: waktu mulai (wajib), waktu selesai, lokasi (wajib), link grup WA.
- Langkah 3: kuota (default 150), batas pendaftaran, add-on (custom URL,
  logo di QR, S&K).
- Langkah 4: field bawaan (Nama, Email — terkunci) + template cepat
  (WA, Institusi, Jabatan) yang bisa ditambah/dihapus.
- Publish: simpan ke store → redirect `dashboard.html?created=<id>` →
  toast sukses di dashboard.

## 5. Pendaftaran (`register.html`)

- Validasi berurutan: nama → email (regex) → WA → tanda tangan → persetujuan.
  Tiap gagal: shake + sorot merah + toast + scroll ke field.
- Tanda tangan: kanvas mouse/sentuh; tombol hapus mengosongkan.
- Sukses (setelah ~420 ms): kode `TIK-1000..9999` acak, QR lokal dari
  payload `KODE|Nama|Email`, confetti, toast sukses.
- QR bisa diklik → lightbox fullscreen (tutup via tombol/backdrop/Escape).
- "Unduh Tiket": mengunduh file GIF QR (`tiket-TIK-XXXX.gif`).

## 6. Scanner (`scanner.html`)

- Saat load: minta kamera (`getUserMedia`, kamera belakang). Bila berhasil:
  video tampil + `play()` eksplisit. Bila gagal/ditolak: kanvas simulasi
  (grid + partikel + teks petunjuk) tampil, foto feed disembunyikan.
- Klik viewfinder: scan sukses (simulasi) — beep Web Audio, kartu
  verifikasi terisi (bergiliran 5 peserta contoh), stempel "VERIFIED"
  beranimasi, badge `942 → 943 … / 1.000`, feed bertambah (maks 8).
- Input manual: kode `TIK-…` (nama "Peserta Terdaftar") atau nama bebas
  (kode acak) → check-in yang sama.
- Standby: overlay tampil, klik viewfinder diabaikan; tombol resume
  mengaktifkan lagi. Toggle auto-scan hanya menyimpan preferensi
  (tidak mengubah perilaku scan di demo ini).
- Tombol Dashboard → `dashboard.html`.
