# Deploy

## 1. Target

- **Platform:** Cloudflare Pages (situs statis, tanpa build).
- **Proyek:** `regesit-ui-rework`
- **URL live:** https://regesit-ui-rework.pages.dev
- **Branch produksi:** `main`

## 2. Cara deploy

```bash
npm run deploy
# = npx wrangler pages deploy . --project-name=regesit-ui-rework
```

Root repo langsung di-deploy (`.`, tanpa build output). `wrangler.toml`:

```toml
name = "regesit-ui-rework"
pages_build_output_dir = "."
```

Alternatif (dipakai agen): `~/workspace/github-actions/cf_pages.py deploy
regesit-ui-rework <dir>` — direct-upload via API Cloudflare, tanpa wrangler.

## 3. Nama proyek

Nama dicoba berurutan: `regesit-ui-rework` → `regesit-ui` → `regesit`.
Nama Pages adalah namespace global: GET project yang 404 **bukan** berarti
nama tersedia — baru ketahuan saat create (subdomain bersufiks = diambil
orang lain; HTTP 409 = dipakai akun Cloudflare lain). Yang terpakai:
**`regesit-ui-rework`** (bersih, tanpa sufiks).

## 4. Verifikasi setelah deploy

- HTTP 200 untuk `/`, `dashboard.html`, `create-event.html`,
  `register.html`, `scanner.html` + aset inti (CSS/JS/gambar).
- Play-test live: wizard publish → dashboard; register → tiket QR;
  scanner klik → check-in.
- Tautan live dipasang di About repo (GitHub → `homepage`).
