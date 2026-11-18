# Data

## 1. Data contoh (hardcode di HTML/JS)

| Tempat | Data |
|---|---|
| `dashboard.html` | 4 event: Tech Summit Indonesia 2026 (Live, 1000), UI/UX Masterclass (Siap Mulai, 500), Indie Sound Fest (Selesai, 1200), City Run 10K (Selesai, 500); 4 peserta di modal detail; statistik 942/1000 |
| `js/scanner.js` | 5 peserta simulasi (Farras, Aditya Pratama, Clarissa Maharani, Hendrik Gunawan, Nadia Safitri) + counter awal 942/1000 |
| `register.html` | Event Tech Summit Indonesia 2026; tiket default `TIK-8821` / Budi Wicaksono |

Semua angka (304 event, rating 4.9, 942 hadir) adalah **angka contoh**,
bukan metrik nyata.

## 2. Skema localStorage

### `regesit.events.v1` — event buatan pengguna

Array JSON, terbaru di depan. Ditulis oleh `js/store.js` (`RegesitStore.add`),
dibaca dashboard saat load (`initStoredEvents()`).

```json
[
  {
    "id": "event-1795040000000",
    "name": "Workshop Uji Coba 2026",
    "venue": "Gedung Uji Coba, Banda Aceh",
    "format": "Offline",
    "start": "5 Des 2026, 09.00",
    "quota": 150,
    "registered": 2,
    "status": "Siap Mulai",
    "url": "register.html?eventId=event-1795040000000"
  }
]
```

- `registered` selalu 2 saat dibuat (progress awal 2/kuota, mengikuti pola
  publish wizard asli).
- Kunci berversi (`v1`) agar perubahan skema tidak merusak data lama
  secara diam-diam.

### `regesit.newsletter` — email newsletter

Array JSON berisi string email (tambah bila belum ada). Ditulis `js/main.js`.

### Menghapus data demo

DevTools → Application → Local Storage → hapus kunci di atas, lalu reload.
Tidak ada tombol hapus di UI (sengaja — ini demo).

## 3. QR payload

Tiket QR berisi teks `KODE|Nama|Email`, contoh:
`TIK-6129|Tamu Uji Coba|tamu@uji.id`. QR dibuat lokal dengan
qrcode-generator (level koreksi M, tipe otomatis) dan disajikan sebagai
data URL GIF. QR scanner panitia memakai URL `https://www.regesit.com/gate/scan?token=…`
(data contoh dari desain asli — token itu bukan kredensial nyata).
