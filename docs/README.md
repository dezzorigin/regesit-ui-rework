# Dokumentasi Regesit UI Rework

Dokumen ini menjelaskan produk apa adanya (per 2026-11-19, v1.1.0).
Tidak ada yang dikarang: semua alur di bawah sudah diuji end-to-end
(`npm test`, 5 tes Playwright).

| Dokumen | Isi |
|---|---|
| [PRD.md](PRD.md) | Produk, pengguna, fitur per halaman, batasan (tanpa backend) |
| [architecture.md](architecture.md) | Arsitektur statis, peta file, dependensi eksternal |
| [pages.md](pages.md) | Perilaku tiap halaman + alur antar-halaman |
| [data.md](data.md) | Data demo + skema localStorage |
| [design.md](design.md) | Token desain & komponen |
| [testing.md](testing.md) | Cara menguji, CI, pengecualian yang didokumentasikan |
| [deploy.md](deploy.md) | Deploy Cloudflare Pages + nama proyek |
| [diagrams.html](diagrams.html) | Diagram arsitektur & alur (HTML+SVG) |
| [screenshots/](screenshots/) | 10 screenshot tampilan asli (hasil `npm run screenshots`) |
| [demo/demo.mp4](demo/demo.mp4) | Video demo 50 detik (10 adegan × 5 detik) |

Arsip: folder [`Documentation/`](../Documentation/) di root repo adalah situs
docs hand-off FE→BE asli penulis (v2.4.0) — disimpan apa adanya sebagai arsip,
bukan sebagai spesifikasi yang sudah terimplementasi. Backend yang dideskripsikan
di sana **tidak ada** di repo ini.
