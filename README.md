# Butik Tasik

Website katalog runway busana islami hari raya. Node.js + Express + EJS + SQLite.
Rencana lengkap ada di [PLAN.md](PLAN.md).

## Menjalankan

```bash
npm install
cp .env.example .env     # isi WA_NUMBER dengan format 62xxxx
npm run seed             # isi data contoh (menghapus data lama)
npm run dev              # http://localhost:3000, auto-restart saat file berubah
```

## API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/collections/:slug/looks?segmen=wanita` | Daftar look + warna + total harga |
| GET | `/api/looks/:id` | Detail look, item, varian |
| POST | `/api/checkout/whatsapp` | Hitung ulang harga di server, kembalikan link `wa.me` |

Segmen: `wanita`, `pria`, `anak_pr`, `anak_lk`, `keluarga`.
