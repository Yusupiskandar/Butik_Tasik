# Prompt Foto Model AI — Butik Tasik

Efek runway hanya rapi kalau **semua foto seragam**. Pakai aturan ini untuk setiap gambar:

- Rasio **2:3 tegak** (mis. 1024×1536), seluruh badan dari kepala sampai kaki, ada sedikit ruang di atas & bawah.
- Model berdiri **menghadap kamera**, tangan bertaut di depan perut, pose sama persis.
- Latar **polos krem hangat (#F2EEE3)**, tanpa properti, bayangan lembut di lantai.
- Cahaya studio lembut dari depan, tanpa bayangan keras.
- Kamera sejajar pinggang, lensa 50 mm, tanpa distorsi.
- Simpan sebagai `uploads/looks/<slug-look>-<warna>.png`, contoh `melati-hijau-pupus.png`.

Tips: buat satu gambar yang paling bagus dulu, lalu gunakan sebagai **gambar referensi**
(image-to-image / "use as reference") supaya model, pose, dan cahaya tetap sama saat ganti warna.

---

## Template dasar

```
Full-body studio fashion photo of a [MODEL], standing straight facing the camera,
hands clasped in front of the waist, neutral gentle smile. Wearing [PAKAIAN] in [WARNA].
Plain warm cream background (#F2EEE3), soft even studio lighting, soft floor shadow,
camera at waist height, 50mm lens, entire body visible from head to shoes with margin,
2:3 portrait, photorealistic, high detail fabric texture, modest Islamic Eid fashion.
```

## Model per segmen

| Segmen | [MODEL] |
|---|---|
| Wanita | Indonesian woman in her late 20s wearing a neatly styled hijab |
| Pria | Indonesian man in his early 30s, short neat hair, wearing a black velvet peci |
| Anak Perempuan | Indonesian girl about 7 years old wearing a simple instant hijab |
| Anak Laki-laki | Indonesian boy about 8 years old wearing a peci |
| Keluarga | Indonesian family of four (father, mother, girl about 7, boy about 8) standing side by side in one row, children in front-center, all facing camera |

## Contoh per look

**Melati (Wanita)** — warna: sage green "Hijau Pupus" / ivory "Putih Gading" / dusty rose
```
...wearing a loose flowing gamis with delicate jasmine flower embroidery on the chest and cuffs,
matching pleated pashmina hijab, small gold flower brooch, in soft sage green...
```

**Kenanga (Wanita)** — sage / mocca / lilac
```
...wearing a loose baju kurung top with fine sequins on a round neckline, wrap skirt with
Tasikmalaya batik motif, voile square hijab, in sage green...
```

**Cempaka (Pria)** — hijau pupus / gading / emerald
```
...wearing a cotton baju koko with embroidered collar and chest pocket, hand-woven checkered sarong,
black velvet peci, in soft sage green...
```

**Sarimbit Melati (Keluarga)** — semua anggota memakai warna yang sama
```
...mother in a jasmine-embroidered gamis with pleated pashmina, father in baju koko with woven sarong
and peci, girl in a tiered children's gamis with instant hijab, boy in baju koko with sarong and peci,
all matching in soft sage green...
```

Untuk look lain, ganti deskripsi pakaian sesuai data di [src/db/seed.js](../src/db/seed.js).
