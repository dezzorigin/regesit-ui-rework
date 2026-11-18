# Desain

## 1. Bahasa visual

Landing memakai gaya editorial "kartu": seksi gelap (`#0f1015`) berselang
dengan kartu putih, tipografi besar DM Sans/Inter, aksen ungu/kuning/peach/
lilac pada bento. Halaman aplikasi (dashboard, wizard, register, scanner)
memakai sistem bento yang sama: kartu putih, radius besar, pill badge,
bayangan lembut.

## 2. Token (landing — `css/style.css`)

| Token | Nilai |
|---|---|
| `--card-dark` | `#0f1015` |
| `--card-white` | `#ffffff` |
| `--radius-pill` | pill penuh (tombol/nav) |
| Font display | DM Sans (700–800), Inter sebagai pendamping |
| Aksen bento | ungu `#7c3aed`-ish, kuning, peach, lilac (per kartu) |

Halaman aplikasi memakai token sendiri di tiap CSS (`--color-primary`
`#1975f9` biru Regesit, `--color-secondary` hijau `#3bc855`) — disengaja
dipertahankan per halaman sesuai pola penulis asli, bukan diseragamkan
paksa.

## 3. Komponen

- **Pill badge** (`.pill-badge` + varian `pill-green/blue/neutral`).
- **Bento card** (`.bento-card`, `.bento-event-card`, `.metric-card`).
- **Stepper wizard** (`.step-node` + `.step-line`, state active/completed).
- **Toast** (`.toast-card`, varian warning/success/info, auto-dismiss 3,5 dtk).
- **Modal overlay** (`.modal-overlay.active`, backdrop blur).
- **Toggle switch** (`.toggle-switch`).
- **QR ticket card** (`.ticket-official-card`, badge `R` di tengah QR).

## 4. Gambar

`Assets/mavka/*.jpg` dipakai landing (hero, bento, layanan, timeline,
avatar). `Assets/tech_summit_banner.jpg` dipakai register,
`Assets/scanner_camera_feed.jpg` sebagai poster viewfinder scanner.
Gambar layanan memakai ulang 4 gambar bento (didokumentasikan di
`index.html`) karena aset `service_*.jpg` asli ikut hilang bersama
folder `Assets/` yang dulu ter-ignore.

Semua gambar di `Assets/` dibuat ulang (AI-generated) 2026-11-19 sebagai
pengganti aset asli yang tidak pernah ter-commit. Bila aset asli ditemukan
di kemudian hari, ganti file-file ini 1:1 (nama file dipertahankan).
