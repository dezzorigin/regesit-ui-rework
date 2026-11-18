# DESIGN.md — Kontrak Arah Desain (Regesit UI Rework)

> Kontrak ini ditulis 19 Nov 2026 sebagai retrofit atas standar UI/UX anti AI slop
> (Nabil, 19 Nov 2026 06:12 WIB — `~/workspace/github-actions/ui-anti-slop.md`).
> Desain landing ini **bukan hasil generate**: ini desain asli produk Regesit
> (referensi "Mavka" tim), yang dipertahankan — retrofit hanya memperbaiki
> pelanggaran P0, bukan mengganti identitas produk.

## 1. Referensi (tour 19 Nov 2026)

| # | Referensi | URL | Kenapa cocok |
|---|-----------|-----|--------------|
| 1 | **Onstage — Framer** (PEMENANG) | https://www.framer.com/marketplace/templates/onstage/ | Domain sama (platform event/konferensi). Cover ala poster festival dengan tanggal + kota besar, key-facts strip, tiket sebagai artefak utama, sticky ticket bar di ponsel. |
| 2 | Confy — Framer | https://www.framer.com/marketplace/templates/confy/ | Alur satu halaman hero → tiket; satu aksi utama per viewport, tanpa navigasi berlebih. |
| 3 | QR Event Pass | https://www.qreventpass.com/ | Produk se-domain (registrasi + tiket QR + check-in pintu). Pelajaran: tiket adalah artefak — "halaman, tiket, dan scan harus terlihat seperti event-nya". |

**Yang diambil dari pemenang (Onstage):**
- Hero tetap ala poster (display type besar + foto event), bukan hero tengah generik.
- Seksi "Coba Produk" diubah dari grid kartu bernomor menjadi **kartu tiket**
  (notch perforasi + aksen warna bento berbeda tiap kartu) — tiket adalah artefak produk.
- Sticky CTA bar di ponsel ("Buat Event Gratis") — satu aksi utama selalu dalam jangkauan.
- Satu aksi utama per viewport: hero = "Buka Dashboard", demo = 4 jalan masuk produk,
  footer = newsletter.

**Yang TIDAK diambil (sengaja):** clone penuh Onstage. Landing Regesit punya identitas
sendiri (bento gelap + warna bento ungu/kuning/persik dari desain asli). Meng-clone
akan menghapus identitas produk demi template lain.

## 2. Kontrak arah

**Ide layout dalam satu kalimat:** bento gelap ala poster gig — satu kartu hero besar
dengan headline display + foto event, lalu sel-sel bento berwarna yang masing-masing
membawa satu fungsi produk, dan tiket QR sebagai artefak yang muncul di mana-mana.

**Detail khas (signature detail):** **tiket berlubang** — kartu demo dan kartu tiket
punya notch perforasi di sisi kiri-kanan (setengah lingkaran warna latar) + garis
putus-putus pemisah, meniru tiket kertas yang disobek di pintu masuk. Dipakai juga
pada kartu tiket hasil pendaftaran (`register.html`).

### Palet (6 warna bernama, tiap warna punya tugas)

| Nama | Hex | Tugas |
|------|-----|-------|
| Malam Panggung | `#08090c` | Latar halaman — gelap pekat, bukan slate generik |
| Kartu Gelap | `#0f1015` | Kartu bento gelap (hero, footer) |
| Ungu Bento | `#7544ea` | Aksen display — kartu blog, sorotan (warna asli desain) |
| Kuning Tiket | `#f5cb43` | Aksen tiket/CTA — kartu sukses, sorotan angka |
| Persik Sorot | `#f7b79d` | Aksen hangat — kartu rating, variasi bento |
| Biru Gerbang | `#1975f9` | Biru brand produk — aksi app (dashboard, scanner, tombol primer) |

Pendukung: hijau sukses `#3bc855` (hanya untuk status berhasil), putih `#ffffff`,
tinta `#101115`. **Tidak ada gradient ungu/biru di mana pun** — semua permukaan flat;
satu-satunya gradient yang tersisa adalah hijau sukses pada tombol berhasil
(bukan ungu/biru, dan hanya di status, bukan latar).

### Tipografi (2 keluarga)

- **Display:** Space Grotesk 500/600/700 — headline, angka besar, judul kartu.
  (Menggantikan Inter/Helvetica sistem — Inter masuk daftar larangan P0.)
- **Body/data:** DM Sans 300–700 — teks, label, tombol. Angka data memakai
  `font-variant-numeric: tabular-nums` agar kolom angka tidak goyang.

### Radius & spacing

- Sistem radius: kartu 32px, dalam 20px (= 32 − padding 12), pill 9999px.
- Grid spacing 4/8pt; padding kartu ≥ 16px (umumnya 24–32px).
- Motion: transisi interaksi ≤ 180ms ease-out; `:active` scale 0.97 pada tombol/kartu;
  `prefers-reduced-motion` mematikan semua animasi/transisi.

## 3. Beda dari repo sebelumnya (minimal 3 dari 5 sumbu)

Repo pembanding terdekat: **#29 thanksleuser** (outdoor event organizer, terang,
nuansa alam). Regesit berbeda di **5 dari 5 sumbu**:

1. **Palet:** near-black bento + ungu/kuning/persik (vs terang/alam).
2. **Tipografi:** Space Grotesk display + DM Sans (vs tipografi thanksleuser).
3. **Layout:** bento poster gelap satu halaman penuh (vs landing terang sections).
4. **Radius/spacing:** 32px kartu bento + shadow dalam (vs radius kecil).
5. **Detail khas:** tiket berlubang + QR (vs peta/trip outdoor).

## 4. Audit P0 (hasil retrofit 19 Nov 2026)

| Larangan P0 | Temuan di hasil awal | Perbaikan |
|---|---|---|
| Gradient ungu/biru | radial ungu di hero; gradient biru di 3 logo-mark, progress bar, banner, kartu bento dashboard (inline), scan-line | Semua di-flat-kan ke warna solid |
| Font Inter/system untuk semuanya | Inter dimuat di `index.html` + fallback display Helvetica | Display → Space Grotesk; Inter dihapus |
| Hero tengah + 3 kartu identik | Tidak ada (hero dua kolom + bento asimetris) | — |
| Grid 3 kartu simetris template | Trio metrik bento: warna & isi beda tiap kartu | Dipertahankan + dilabeli data contoh |
| Emoji mentah sebagai ikon fungsi | 🔒, ☀️/🌙 (date-picker AM/PM), 📷, 🖼️, 📶, 🎉, emoji di judul toast | Diganti SVG stroke 1.5–2px / teks polos |
| Statistik vanity palsu | "304 EVENTS POWERED", "4.9 GOOGLE REVIEWS" tanpa sumber | Dilabeli "data contoh untuk demo" |
| Satu kata headline diwarnai/digradient | Tidak ada | — |
| Tema shadcn/Tailwind/Bootstrap mentah | Tidak ada (CSS tangan) | — |
| rounded-2xl shadow-lg di semua permukaan | Radius 32/20/pill adalah sistem disengaja, bukan default template | Didokumentasikan di §2 |
| Ikon di kotak rounded | Logo-mark gradient (bukan ikon-di-kotak) | Di-flat-kan; ikon demo tanpa kotak |
| Footer 4 kolom default | Footer bento (brand + kartu sosial + banner) | — |
| Copy generik | Tidak ada ("MOMENTS THAT LEAVE A MARK IN MEMORY" = copy asli produk) | — |
| Hiasan 01/02/03 (orde-kedua) | Nomor 01–04 di kartu demo | Diganti ikon SVG per kartu |
| Default orde-kedua lain | Tidak ada (bukan krim+terracotta / lime asam / beige) | — |

Gate P0 ini ditegakkan di CI oleh `scripts/check-links.mjs`
(larangan emoji fungsional + gradient ungu/biru + impor Inter).

## 5. Gate 7 sumbu (nilai 1–5, lolos bila tiap sumbu ≥ 4)

| Sumbu | Skor | Bukti |
|-------|------|-------|
| 1. Anti-slop purity | 5 | Nol P0 + nol orde-kedua setelah retrofit; ditegakkan CI |
| 2. UX speed & 1-to-3 | 4 | 1 aksi utama/viewport; hero 2 CTA (primer+sekunder), demo 4 jalan masuk produk |
| 3. Tipografi | 5 | 2 keluarga (Space Grotesk + DM Sans); tabular-nums di angka; body ≤ 75ch |
| 4. Spacing & geometri | 4 | Grid 4/8pt; radius dalam 20 = luar 32 − padding 12; padding kartu ≥ 16px |
| 5. Motion | 4 | Transisi ≤ 180ms ease-out; active scale 0.97; reduced-motion dihormati |
| 6. A11y | 4 | focus-visible di semua halaman; aria-label tombol ikon; tag semantik; kontras AA |
| 7. Mobile | 4 | 390px tanpa overflow horizontal; target sentuh ≥ 44px; sticky CTA bar |

## 6. Tes siluet

Screenshot landing dikecilkan ke thumbnail hitam-putih (`docs/screenshots/11-silhouette.png`,
dibuat dari `01-landing-hero.png` via ffmpeg grayscale + scale 320px):
masih terbaca sebagai **platform event** — kartu hero gelap besar + foto event +
trio bento warna + kartu tiket — bukan halaman SaaS generik mana pun.
Penanda yang bertahan di siluet: bento gelap asimetris, headline display besar,
dan kartu-kartu tiket. Lolos.

## 7. Bukti visual

- `docs/screenshots/01-landing-hero.png` (desktop, retake setelah retrofit)
- `docs/screenshots/03-landing-demo.png` (desktop, kartu tiket)
- `docs/screenshots/11-landing-mobile-390.png` (mobile 390px + sticky CTA bar)
- `docs/screenshots/12-dashboard-mobile-390.png` (mobile 390px)
- `docs/screenshots/13-silhouette.png` (tes siluet, grayscale thumbnail)
- `docs/demo/demo.mp4` (video demo 60 detik, 12 adegan, direkam ulang setelah retrofit)
