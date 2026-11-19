# Rencana Proyek: Website Butik "Runway" (Node.js)

Website katalog butik yang menampilkan produk sebagai **peragaan busana (runway)**, bukan grid biasa.
Pembeli bisa memilih look, mengganti warna/potongan, menambah item satuan atau satu look sekaligus,
lalu mengirim pesanan ke **WhatsApp** butik. Referensi: video "MUSE — Raya Atelier".

---

## 1. Tujuan & Ruang Lingkup

**Versi 1 (MVP)**
- Halaman runway: deretan look dengan efek kedalaman (look aktif tajam, lainnya blur/pudar).
- Tab segmen: Wanita / Pria / Anak Perempuan / Anak Laki-laki / Keluarga.
- Panel "Isi Look": daftar item dalam look, harga, tombol + per item, dan "Tambah semua".
- Pilihan warna (colour story) per look.
- Keranjang (drawer samping): jumlah, varian, hapus, "Hapus semua" + Undo.
- Checkout: **pesan via WhatsApp** (pesan otomatis berisi daftar belanja) + unduh daftar belanja (PDF/gambar).
- Lookbook (favorit) disimpan di browser.
- Panel admin sederhana: kelola koleksi, look, item, warna, foto, harga, stok.
- Responsif (HP adalah prioritas, karena kebanyakan pembeli dari Instagram/TikTok).

**Di luar MVP (tahap berikutnya)**
- Payment gateway (Midtrans/Xendit), ongkir (RajaOngkir), akun pelanggan, laporan penjualan.

---

## 2. Stack Teknologi

| Bagian | Pilihan | Alasan |
|---|---|---|
| Runtime | **Node.js 22 LTS** | Sesuai permintaan, stabil |
| Server | **Express 5** | Sederhana, banyak dokumentasi |
| Template halaman | **EJS** | Render HTML di server → cepat & bagus untuk SEO |
| Interaksi frontend | **JavaScript murni (vanilla) + CSS** | Tanpa framework berat; animasi runway cukup dengan CSS transform/filter |
| Database | **SQLite** via `better-sqlite3` | Satu file, tanpa server DB, cukup untuk butik kecil–menengah |
| Upload & olah foto | `multer` + `sharp` | Upload foto, otomatis dibuat versi WebP berbagai ukuran |
| Login admin | `express-session` + `bcrypt` | Satu/beberapa akun admin |
| Validasi | `zod` | Validasi input form admin & API |
| Daftar belanja | `pdfkit` (server) | Unduh daftar belanja sebagai PDF |
| Dev tools | `nodemon`, `eslint`, `prettier` | Kenyamanan pengembangan |
| Deploy | VPS (Niagahoster/IDCloudHost/DigitalOcean) + PM2 + Nginx, atau Railway/Render | Murah, SQLite butuh disk permanen |

> Catatan: kalau nanti butuh tampilan yang jauh lebih interaktif, frontend bisa dipindah ke React/Vite
> tanpa mengubah API — karena data sudah lewat endpoint JSON.

---

## 3. Struktur Folder

```
Butik/
├─ package.json
├─ .env.example            # PORT, SESSION_SECRET, WA_NUMBER, NAMA_BUTIK
├─ src/
│  ├─ server.js            # entry point Express
│  ├─ config.js
│  ├─ db/
│  │  ├─ schema.sql        # definisi tabel
│  │  ├─ seed.js           # data contoh (koleksi, look, item)
│  │  └─ index.js          # koneksi better-sqlite3
│  ├─ routes/
│  │  ├─ public.js         # halaman runway, lookbook
│  │  ├─ api.js            # JSON: koleksi, look, item, varian
│  │  └─ admin.js          # CRUD admin
│  ├─ services/            # logika: harga look, pesan WA, PDF
│  ├─ middleware/          # auth admin, error handler, upload
│  └─ views/               # template EJS
│     ├─ layout.ejs
│     ├─ runway.ejs
│     ├─ partials/ (header, panel-look, cart-drawer)
│     └─ admin/ (login, dashboard, form koleksi/look/item)
├─ public/
│  ├─ css/ (tokens.css, runway.css, cart.css, admin.css)
│  ├─ js/  (runway.js, look-panel.js, cart.js, lookbook.js)
│  └─ fonts/
└─ uploads/                # foto produk & model (tidak masuk git)
```

---

## 4. Desain Database (SQLite)

```
collections   id, slug, nama, tagline, aktif, urutan
               → contoh: "Lebaran Bersemi 2027"

looks          id, collection_id, segmen (wanita|pria|anak_pr|anak_lk|keluarga),
               nama (Mawar, Melati...), urutan, foto_model, aktif

colour_stories id, look_id, nama_warna, kode_hex, foto_model_varian
               → satu look bisa punya beberapa warna; foto model ganti sesuai warna

items          id, nama, kategori (atasan|bawahan|kerudung|aksesori|...),
               deskripsi, harga, foto

item_variants  id, item_id, warna, ukuran, stok, sku

look_items     look_id, item_id, peran (Ayah|Ibu|Anak..., untuk look keluarga),
               opsional (boleh dilepas, mis. bros), urutan

admins         id, email, password_hash, dibuat
orders_log     id, isi_json, total, dibuat     # catatan pesanan yang dikirim ke WA
```

---

## 5. API & Halaman

**Halaman publik**
- `GET /` → runway koleksi aktif (default segmen Wanita)
- `GET /?segmen=keluarga&look=mawar` → link bisa dibagikan langsung ke look tertentu
- `GET /lookbook` → look favorit

**API JSON**
- `GET /api/collections/:slug/looks?segmen=` → daftar look + warna
- `GET /api/looks/:id` → detail look, item, varian, total harga
- `POST /api/checkout/whatsapp` → simpan log, kembalikan link `wa.me/<nomor>?text=...`
- `POST /api/shopping-list.pdf` → PDF daftar belanja

**Admin** (`/admin`, wajib login)
- Login/logout, dashboard ringkas
- CRUD koleksi, look, warna, item, varian, susun item ke dalam look (drag urutan)
- Upload foto (otomatis dikompres ke WebP)

> Keranjang & lookbook disimpan di `localStorage` (cepat, tanpa akun). Harga selalu dihitung ulang
> di server saat checkout agar tidak bisa dimanipulasi.

---

## 6. Detail Tampilan (dari analisis video)

- **Runway:** look disusun berlapis dengan `transform: translateX/scale` dan `filter: blur()`,
  `opacity` makin kecil ke belakang. Pindah look dengan scroll, swipe (HP), tombol ← →, dan keyboard.
- **Indikator:** "LOOK 01 / 09" + progress bar bersegmen.
- **Panel "Isi Look":** label kategori huruf kapital kecil, nama item, harga, tombol +;
  di atas: "Tambah look · Rp xxx". Item opsional bisa dilepas ("Tanpa bros").
- **Mode Keluarga:** harga per anggota (Ayah, Ibu, Anak) + total satu keluarga.
- **Keranjang:** drawer kanan, latar digelapkan, "Hapus semua" dengan Undo, keadaan kosong yang ramah.
- **Gaya:** latar krem hangat, aksen hijau tua, judul serif condensed (mis. *Fraunces*/*Playfair*),
  teks UI sans-serif (mis. *DM Sans*). Mata uang Rupiah.
- **HP:** panel item jadi bottom sheet yang bisa ditarik; runway full-width dengan swipe.
- **Foto:** semua foto model harus seragam (pose, latar polos, pencahayaan sama, rasio sama) —
  ini syarat utama agar efek runway terlihat rapi.

---

## 7. Tahapan Pengerjaan

| Tahap | Pekerjaan | Hasil |
|---|---|---|
| **1. Fondasi** ✅ | Init proyek, Express, EJS, struktur folder, SQLite + schema + seed data contoh | Server jalan, data contoh tampil sebagai JSON |
| **2. Runway** ✅ | Layout 2 kolom, animasi deretan look, navigasi, tab segmen, indikator | Halaman runway bisa dijelajahi |
| **3. Panel look & warna** ✅ | Panel "Isi Look", ganti colour story, item opsional, mode Keluarga | Pembeli bisa melihat isi & harga tiap look |
| **4. Keranjang & checkout** 🟡 (tinggal PDF) | Drawer keranjang, Undo, lookbook, pesan WhatsApp, PDF daftar belanja | Alur belanja lengkap |
| **5. Admin** | Login, CRUD, upload & kompres foto | Pemilik bisa mengelola produk sendiri |
| **6. Poles** | Responsif HP, aksesibilitas (keyboard, alt text), SEO/Open Graph, performa gambar (lazy load) | Siap dipakai publik |
| **7. Deploy** | VPS/Railway, domain, HTTPS, backup file SQLite & folder uploads | Website online |

---

## 8. Keputusan (19 Nov 2026)

1. **Nama butik:** Butik Tasik — logo monogram **"BT"**, warna merek **hijau daun muda**.
2. **Produk:** busana islami untuk hari raya (gamis, kebaya/kurung, koko, sarung, hijab, sarimbit keluarga).
3. **WhatsApp:** nomor sementara `082xxxx` (disimpan di `.env` → `WA_NUMBER`, diganti nanti).
4. **Foto model:** dibuat dengan AI untuk demo. Sementara memakai ilustrasi SVG; prompt foto AI ada di `docs/prompt-foto-ai.md`.
5. **Checkout:** WhatsApp dulu, payment gateway nanti.
6. **Hosting:** belum ditentukan.
