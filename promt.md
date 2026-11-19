# Prompt Gemini — Foto Model Demo Butik Tasik

Satu prompt untuk membuat **13 foto model**, satu foto untuk setiap look di website, memakai warna pertama tiap look.
Foto ini akan menggantikan ilustrasi SVG yang sekarang dipakai di runway.

## Cara pakai

1. Buka **Gemini** (gemini.google.com). Pilih mode pembuatan gambar (model gambar terbaru).
2. Salin **seluruh isi kotak prompt di bawah** lalu kirim sekali saja.
3. Gemini akan membuat gambar satu per satu. Kalau berhenti sebelum 13 gambar, ketik:
   `Lanjutkan dari gambar berikutnya dengan aturan yang sama.`
4. Unduh setiap gambar, lalu simpan ke folder `uploads/looks/` dengan **nama file persis** seperti di daftar
   (contoh `uploads/looks/melati.png`).
5. Kabari saya kalau sudah, nanti saya pasang ke website.

> Tips: kalau ada gambar yang meleset (pose beda, latar tidak polos, terpotong), minta ulang satu gambar itu saja:
> `Ulangi gambar 5 (seroja.png). Pastikan seluruh badan terlihat dan latar polos krem.`

---

## Prompt (salin semua)

```
You are producing a consistent set of 13 product photos for an Indonesian Islamic Eid (Lebaran)
fashion boutique called "Butik Tasik". Generate 13 SEPARATE images, one at a time, in the order listed.
Before each image, write its file name on one line (for example: "1 — melati.png").
Do not combine several outfits into one image, and do not add text, logos or watermarks inside the images.

STRICT RULES FOR EVERY IMAGE (they must look like one photoshoot):
- Photorealistic studio fashion photography, high detail fabric texture, modest and elegant.
- Plain seamless warm cream background, hex #F2EEE3, with no props, no furniture, no plants, and no gradient spots.
- A soft, natural contact shadow on the floor directly under the feet. No other shadows.
- Soft, even, frontal studio lighting with no harsh shadows. The same lighting in every image.
- The camera is straight on at waist height, with a 50mm lens look and no wide-angle distortion.
- FULL BODY: the whole body is visible from the top of the head (or headwear) to the shoes, with
  empty margin above the head and below the feet. Never crop the feet or the head.
- The person stands straight, facing the camera, centered, with a calm gentle smile.
- Women and girls: hands softly clasped in front of the waist. Men and boys: arms relaxed straight at the sides.
- Use the SAME models across all images: the same adult woman, the same adult man, the same girl
  and the same boy, so they look like one family.
    * Woman: Indonesian, late 20s, warm light-tan skin, wearing a neatly wrapped hijab that fully covers
      her hair and neck.
    * Man: Indonesian, early 30s, short neat black hair, clean short beard, warm tan skin.
    * Girl: Indonesian, about 7 years old, wearing a hijab that covers her hair.
    * Boy: Indonesian, about 8 years old, short black hair.
- Clothing colors must match the given hex codes closely. All pieces in one outfit share the same color
  family unless stated otherwise.
- Aspect ratio: single-person images 2:3 portrait. Family images 1:1 square.

THE 13 IMAGES:

1 — melati.png (2:3, woman)
Loose, flowing floor-length gamis in soft sage green "Hijau Pupus" (#A8C98A) with delicate white jasmine
flower embroidery on the chest and along the sleeve cuffs and hem. A matching pleated chiffon pashmina hijab
in a lighter tone of the same green. A small gold flower brooch with a pearl on the left chest. Nude flat shoes.

2 — kenanga.png (2:3, woman)
A loose knee-length baju kurung top in muted sage green (#9CAF88) with fine tonal sequins on a round neckline.
An ankle-length wrap skirt with a traditional Tasikmalaya batik motif in darker sage and cream tones.
A matching voile square hijab. A small gold flower brooch. Nude flat shoes.

3 — anggrek.png (2:3, woman)
A long tunic with soft balloon sleeves in lilac (#B9A6CF) over wide-leg linen culottes in a slightly
deeper lilac. A matching pleated chiffon pashmina hijab. Nude flat shoes.

4 — cempaka.png (2:3, man)
A cotton baju koko in soft sage green "Hijau Pupus" (#A8C98A) with tonal embroidery on the collar and
chest pocket, hip length. A hand-woven checkered sarong in a deeper green with fine lines, worn at the waist
down to the ankles. A black velvet peci. Dark brown leather sandals.

5 — seroja.png (2:3, man)
A long semi-formal kurta in muted sage green (#9CAF88) reaching below the knee, with a hidden button placket
and a small mandarin collar. Straight-cut trousers in a darker sage. A black velvet peci. Dark brown loafers.

6 — kamboja.png (2:3, man)
A Saudi-style long jubah (thobe) in ivory "Putih Gading" (#EFE8D8), floor length, made of a lightweight fabric.
A cream sorban (rida) shawl with tassels draped over one shoulder. A black velvet peci. Brown leather sandals.

7 — dahlia.png (2:3, girl)
A children's floor-length gamis in dusty rose (#D9A5A0) with a tiered, ruffled skirt and small embroidered
flowers on the chest. A matching jersey instant hijab. Small nude shoes.

8 — teratai.png (2:3, girl)
A children's set in sky blue "Biru Langit" (#A9C4D9): a long tunic with lotus flower embroidery and matching
straight trousers. A matching jersey instant hijab. Small white shoes.

9 — tunjung.png (2:3, boy)
A children's cotton baju koko in soft sage green (#A8C98A), hip length, with a small embroidered collar.
A children's checkered sarong in a deeper green down to the ankles. A small knitted peci. Brown sandals.

10 — asoka.png (2:3, boy)
A children's kurta in muted sage green (#9CAF88) with a mandarin (shanghai) collar, reaching mid-thigh.
Matching darker sage trousers with an elastic waist. A small knitted peci. Brown sandals.

11 — sarimbit-melati.png (1:1, family of four)
The same woman, man, girl and boy standing side by side in one row, facing the camera, with the children in
front between the parents. From left to right: father, boy, girl, mother. Everyone wears matching soft sage
green "Hijau Pupus" (#A8C98A):
mother in the jasmine-embroidered gamis and pleated pashmina from image 1; father in the baju koko, checkered
sarong and black peci from image 4; girl in a tiered children's gamis with an instant hijab, in the same green;
boy in the children's koko, sarong and knitted peci from image 9.

12 — sarimbit-kenanga.png (1:1, family of four)
The same family in the same arrangement, all in muted sage green (#9CAF88):
mother in the baju kurung with the Tasikmalaya batik wrap skirt and voile hijab from image 2; father in the
long kurta and trousers from image 5; girl in a children's tunic and trousers set with an instant hijab, in sage;
boy in the children's kurta and trousers from image 10.

13 — sarimbit-cempaka.png (1:1, family of four)
The same family in the same arrangement, all in ivory "Putih Gading" (#EFE8D8):
mother in a long tunic with balloon sleeves, wide culottes and a pleated pashmina; father in the long jubah,
sorban and black peci from image 6; girl in a tiered children's gamis with an instant hijab; boy in a
children's koko with trousers and a knitted peci.

Start now with image 1.
```

---

## Daftar file yang dibutuhkan

| No | Nama file | Segmen | Warna |
|---|---|---|---|
| 1 | `melati.png` | Wanita | Hijau Pupus |
| 2 | `kenanga.png` | Wanita | Sage |
| 3 | `anggrek.png` | Wanita | Lilac |
| 4 | `cempaka.png` | Pria | Hijau Pupus |
| 5 | `seroja.png` | Pria | Sage |
| 6 | `kamboja.png` | Pria | Putih Gading |
| 7 | `dahlia.png` | Anak Perempuan | Dusty Rose |
| 8 | `teratai.png` | Anak Perempuan | Biru Langit |
| 9 | `tunjung.png` | Anak Laki-laki | Hijau Pupus |
| 10 | `asoka.png` | Anak Laki-laki | Sage |
| 11 | `sarimbit-melati.png` | Keluarga | Hijau Pupus |
| 12 | `sarimbit-kenanga.png` | Keluarga | Sage |
| 13 | `sarimbit-cempaka.png` | Keluarga | Putih Gading |

Semua disimpan di folder `uploads/looks/`.

## Catatan

- Setiap look sebenarnya punya 3 pilihan warna. Untuk demo cukup **1 warna per look** (13 foto).
  Selama foto warna lain belum ada, pilihan warna tersebut tetap memakai ilustrasi.
  Kalau nanti mau lengkap, minta ke Gemini: `Buat ulang gambar 1 dengan warna Putih Gading (#EFE8D8), semua aturan sama.`
  Simpan dengan nama `melati-putih-gading.png`.
- Foto produk satuan (gamis, pashmina, bros, dan lainnya) untuk panel kanan belum dibutuhkan.
  Untuk demo, gambar kecilnya bisa dipotong dari foto model.
