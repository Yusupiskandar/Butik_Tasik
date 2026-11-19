// Mengisi database dengan data contoh koleksi Lebaran Butik Tasik.
// Jalankan: npm run seed   (data lama akan dihapus)
import { db } from './index.js';

const WARNA = {
  hijauPupus: ['Hijau Pupus', '#A8C98A'],
  gading: ['Putih Gading', '#EFE8D8'],
  dustyRose: ['Merah Jambu', '#D9A5A0'],
  biruLangit: ['Biru Langit', '#A9C4D9'],
  sage: ['Hijau Lumut', '#9CAF88'],
  lilac: ['Ungu Muda', '#B9A6CF'],
  mocca: ['Cokelat Susu', '#C2A27E'],
  emerald: ['Hijau Zamrud', '#2F6B4F'],
};

const UKURAN_DEWASA = ['S', 'M', 'L', 'XL'];
const UKURAN_ANAK = ['2-4 th', '5-7 th', '8-10 th'];

// kode item → [nama, kategori, harga, deskripsi, anak?]
const ITEMS = {
  // Nama memakai istilah toko busana muslim Indonesia + ciri khas Tasikmalaya (bordir & batik Tasik).
  gamisMelati: ['Gamis Bordir Tasik', 'Gamis', 489000, 'Gamis katun rayon, bordir tangan khas Tasikmalaya motif melati di dada dan ujung lengan.'],
  pashminaPlisket: ['Pashmina Plisket', 'Kerudung', 89000, 'Pashmina plisket ceruty, jatuh dan tidak menerawang.'],
  brosBunga: ['Bros Bunga Melati', 'Aksesori', 49000, 'Bros warna emas bentuk bunga melati dengan mutiara.'],
  kurungKenanga: ['Tunik Payet Kerah Bulat', 'Atasan', 359000, 'Tunik longgar sepanjang lutut, kerah bulat dengan payet halus.'],
  rokBatik: ['Rok Lilit Batik Tasik', 'Bawahan', 229000, 'Rok lilit motif batik Sukapura khas Tasikmalaya.'],
  segiEmpat: ['Hijab Segi Empat Voal', 'Kerudung', 79000, 'Voal premium, tegak di dahi dan mudah dibentuk.'],
  tunikAnggrek: ['Tunik Lengan Balon', 'Atasan', 299000, 'Tunik panjang dengan lengan balon, cocok untuk silaturahmi.'],
  kulotLinen: ['Celana Kulot Linen', 'Bawahan', 199000, 'Kulot linen lebar, pinggang karet.'],
  kokoCempaka: ['Baju Koko Bordir Tasik', 'Atasan', 279000, 'Koko katun toyobo, bordir Tasik di kerah dan saku.'],
  sarungTenun: ['Sarung Tenun Majalaya', 'Bawahan', 249000, 'Sarung tenun motif kotak dari Majalaya, Jawa Barat.'],
  peci: ['Peci Hitam Beludru', 'Aksesori', 69000, 'Peci nasional beludru hitam, tinggi 9 cm.'],
  kurtaSeroja: ['Koko Panjang Kerah Shanghai', 'Atasan', 319000, 'Koko panjang selutut, kancing tersembunyi, rapi untuk silaturahmi.'],
  celanaBahan: ['Celana Panjang Bahan', 'Bawahan', 189000, 'Celana bahan potongan lurus.'],
  jubahKamboja: ['Gamis Pria Polos', 'Gamis', 429000, 'Gamis pria panjang semata kaki, bahan adem untuk ibadah.'],
  sorban: ['Sorban Rumbai', 'Aksesori', 99000, 'Sorban selempang dengan rumbai di ujungnya.'],
  gamisDahlia: ['Gamis Anak Rempel', 'Gamis', 219000, 'Gamis anak dengan rok rempel bersusun.', true],
  bergoAnak: ['Bergo Anak Jersey', 'Kerudung', 49000, 'Kerudung instan anak, bahan jersey adem.', true],
  setTeratai: ['Setelan Tunik Anak Bordir', 'Setelan', 249000, 'Tunik dan celana anak dengan bordir bunga teratai.', true],
  kokoTunjung: ['Baju Koko Anak', 'Atasan', 169000, 'Koko anak katun, nyaman dipakai seharian.', true],
  celanaAnak: ['Celana Panjang Anak', 'Bawahan', 99000, 'Celana anak pinggang karet.', true],
  peciAnak: ['Peci Rajut Anak', 'Aksesori', 39000, 'Peci rajut anak, ringan dan tidak gerah.', true],
  sarungAnak: ['Sarung Celana Anak', 'Bawahan', 119000, 'Sarung model celana, praktis untuk anak.', true],
  kurtaAsoka: ['Koko Panjang Anak', 'Atasan', 179000, 'Koko panjang anak, kerah shanghai.', true],
};

// [kodeFoto, segmen, nama, deskripsi, [warna...], [[item, peran?, opsional?], ...]]
// kodeFoto = nama file foto di public/img/looks/; slug link dibuat dari nama.
const LOOKS = [
  ['melati', 'wanita', 'Syahdu', 'Gamis lembut dengan bordir melati.', ['hijauPupus', 'gading', 'dustyRose'],
    [['gamisMelati'], ['pashminaPlisket'], ['brosBunga', null, true]]],
  ['kenanga', 'wanita', 'Sekar Tasik', 'Tunik payet dan rok batik Tasik.', ['sage', 'mocca', 'lilac'],
    [['kurungKenanga'], ['rokBatik'], ['segiEmpat'], ['brosBunga', null, true]]],
  ['anggrek', 'wanita', 'Lembayung', 'Tunik santai untuk silaturahmi.', ['lilac', 'biruLangit', 'gading'],
    [['tunikAnggrek'], ['kulotLinen'], ['pashminaPlisket']]],
  ['cempaka', 'pria', 'Takbiran', 'Koko dan sarung tenun untuk salat Id.', ['hijauPupus', 'gading', 'emerald'],
    [['kokoCempaka'], ['sarungTenun'], ['peci', null, true]]],
  ['seroja', 'pria', 'Silaturahmi', 'Koko panjang rapi untuk silaturahmi.', ['sage', 'biruLangit', 'mocca'],
    [['kurtaSeroja'], ['celanaBahan'], ['peci', null, true]]],
  ['kamboja', 'pria', 'Khusyuk', 'Gamis pria adem untuk salat Id.', ['gading', 'mocca', 'emerald'],
    [['jubahKamboja'], ['sorban', null, true], ['peci', null, true]]],
  ['dahlia', 'anak_pr', 'Ceria', 'Gamis anak rempel bersusun.', ['dustyRose', 'hijauPupus', 'lilac'],
    [['gamisDahlia'], ['bergoAnak']]],
  ['teratai', 'anak_pr', 'Riang', 'Setelan anak yang lincah.', ['biruLangit', 'sage', 'gading'],
    [['setTeratai'], ['bergoAnak']]],
  ['tunjung', 'anak_lk', 'Sholeh', 'Koko anak dan sarung instan.', ['hijauPupus', 'gading', 'emerald'],
    [['kokoTunjung'], ['sarungAnak'], ['peciAnak', null, true]]],
  ['asoka', 'anak_lk', 'Gagah', 'Koko panjang anak kerah shanghai.', ['sage', 'biruLangit', 'mocca'],
    [['kurtaAsoka'], ['celanaAnak'], ['peciAnak', null, true]]],
  ['sarimbit-melati', 'keluarga', 'Sarimbit Sakinah', 'Satu warna untuk satu keluarga.', ['hijauPupus', 'gading', 'dustyRose'],
    [['gamisMelati', 'Ibu'], ['pashminaPlisket', 'Ibu'], ['kokoCempaka', 'Ayah'], ['sarungTenun', 'Ayah'],
     ['peci', 'Ayah', true], ['gamisDahlia', 'Anak Perempuan'], ['bergoAnak', 'Anak Perempuan'],
     ['kokoTunjung', 'Anak Laki-laki'], ['sarungAnak', 'Anak Laki-laki'], ['peciAnak', 'Anak Laki-laki', true]]],
  ['sarimbit-kenanga', 'keluarga', 'Sarimbit Mudik', 'Batik Tasik untuk seisi rumah.', ['sage', 'mocca', 'lilac'],
    [['kurungKenanga', 'Ibu'], ['rokBatik', 'Ibu'], ['segiEmpat', 'Ibu'], ['kurtaSeroja', 'Ayah'], ['celanaBahan', 'Ayah'],
     ['setTeratai', 'Anak Perempuan'], ['bergoAnak', 'Anak Perempuan'], ['kurtaAsoka', 'Anak Laki-laki'], ['celanaAnak', 'Anak Laki-laki']]],
  ['sarimbit-cempaka', 'keluarga', 'Sarimbit Fitri', 'Putih bersih di hari yang fitri.', ['gading', 'emerald', 'biruLangit'],
    [['tunikAnggrek', 'Ibu'], ['kulotLinen', 'Ibu'], ['pashminaPlisket', 'Ibu'], ['jubahKamboja', 'Ayah'], ['peci', 'Ayah', true],
     ['gamisDahlia', 'Anak Perempuan'], ['bergoAnak', 'Anak Perempuan'], ['kokoTunjung', 'Anak Laki-laki'], ['celanaAnak', 'Anak Laki-laki']]],
];

const seed = db.transaction(() => {
  for (const t of ['orders_log', 'look_items', 'item_variants', 'items', 'colour_stories', 'looks', 'collections']) {
    db.prepare(`DELETE FROM ${t}`).run();
  }

  const { lastInsertRowid: collectionId } = db
    .prepare('INSERT INTO collections (slug, nama, tagline, urutan) VALUES (?, ?, ?, 0)')
    .run('lebaran-bersemi-2027', 'Lebaran Bersemi', 'Geser untuk melihat koleksi. Pilih warna, lepas aksesori, lalu pesan lewat WhatsApp.');

  const insItem = db.prepare('INSERT INTO items (nama, kategori, harga, deskripsi) VALUES (?, ?, ?, ?)');
  const itemId = {};
  for (const [kode, [nama, kategori, harga, deskripsi]] of Object.entries(ITEMS)) {
    itemId[kode] = insItem.run(nama, kategori, harga, deskripsi).lastInsertRowid;
  }

  const insLook = db.prepare('INSERT INTO looks (collection_id, slug, segmen, nama, deskripsi, urutan) VALUES (?, ?, ?, ?, ?, ?)');
  const insColour = db.prepare(
    'INSERT INTO colour_stories (look_id, nama_warna, kode_hex, foto_model, urutan) VALUES (?, ?, ?, ?, ?)'
  );
  const insLookItem = db.prepare('INSERT INTO look_items (look_id, item_id, peran, opsional, urutan) VALUES (?, ?, ?, ?, ?)');
  const insVariant = db.prepare('INSERT OR IGNORE INTO item_variants (item_id, warna, ukuran, stok, sku) VALUES (?, ?, ?, ?, ?)');

  // Slug untuk link dibuat dari nama set: "Sarimbit Fitri" → "sarimbit-fitri".
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const urutanPerSegmen = {};
  for (const [kodeFoto, segmen, nama, deskripsi, warna, isi] of LOOKS) {
    const urutan = (urutanPerSegmen[segmen] = (urutanPerSegmen[segmen] ?? -1) + 1);
    const lookId = insLook.run(collectionId, slugify(nama), segmen, nama, deskripsi, urutan).lastInsertRowid;
    // Foto model AI demo baru tersedia untuk warna pertama tiap set (public/img/looks/<kodeFoto>.webp).
    warna.forEach((w, i) => insColour.run(lookId, WARNA[w][0], WARNA[w][1], i === 0 ? `/img/looks/${kodeFoto}.webp` : null, i));

    isi.forEach(([kode, peran = null, opsional = false], i) => {
      insLookItem.run(lookId, itemId[kode], peran ?? '', opsional ? 1 : 0, i);
      const anak = ITEMS[kode][4];
      for (const w of warna) {
        for (const ukuran of anak ? UKURAN_ANAK : UKURAN_DEWASA) {
          const sku = `BT-${itemId[kode]}-${w}-${ukuran}`.replace(/\s+/g, '').toUpperCase();
          insVariant.run(itemId[kode], WARNA[w][0], ukuran, 10, sku);
        }
      }
    });
  }
});

seed();

const hitung = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
console.log(
  `Seed selesai: ${hitung('looks')} look, ${hitung('colour_stories')} warna, ` +
    `${hitung('items')} item, ${hitung('item_variants')} varian.`
);
