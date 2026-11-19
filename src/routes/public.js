import { Router } from 'express';
import { config, SEGMEN } from '../config.js';
import { getActiveCollection, listLooks, getLook } from '../services/catalog.js';

export const pub = Router();

// JSON aman untuk disisipkan ke dalam <script>.
const jsonAman = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

const segmenDariUrl = (url) => SEGMEN.find((s) => s.url === url);
const segmenDariKode = (kode) => SEGMEN.find((s) => s.kode === kode);

function semuaSet(collection) {
  return Object.fromEntries(SEGMEN.map((s) => [s.kode, listLooks(collection.id, s.kode).map((l) => getLook(l.id))]));
}

function tampilkan(res, segmen, slugSet) {
  const collection = getActiveCollection();
  if (!collection) return res.status(503).send('Belum ada koleksi aktif.');

  // Semua segmen dikirim sekaligus (datanya kecil) supaya pindah tab bisa tanpa reload halaman.
  const semua = semuaSet(collection);
  const looks = semua[segmen.kode];
  const idx = slugSet ? looks.findIndex((l) => l.slug === slugSet) : 0;
  if (idx < 0) return res.redirect(301, `/${segmen.url}`); // nama set tidak dikenal → ke set pertama tab itu

  res.render('runway', {
    collection,
    segmen: segmen.kode,
    looks,
    awal: idx,
    dataJson: jsonAman({
      segmen: segmen.kode,
      semua,
      awal: idx,
      urlSegmen: Object.fromEntries(SEGMEN.map((s) => [s.kode, s.url])),
      waAktif: config.waNumber.length >= 10,
    }),
  });
}

// Halaman utama. Link model lama (?segmen=…&look=…) dialihkan permanen ke link bersih.
pub.get('/', (req, res) => {
  const lama = segmenDariKode(req.query.segmen);
  if (lama) {
    const collection = getActiveCollection();
    const set = collection && req.query.look ? cariSetLama(collection, lama.kode, String(req.query.look)) : null;
    return res.redirect(301, `/${lama.url}${set ? `/${set.slug}` : ''}`);
  }
  tampilkan(res, SEGMEN[0]);
});

// Link lama memakai kode foto (mis. "melati"), link baru memakai nama set (mis. "syahdu").
function cariSetLama(collection, kode, slugLama) {
  return semuaSet(collection)[kode].find(
    (l) => l.slug === slugLama || l.warna.some((w) => w.foto_model === `/img/looks/${slugLama}.webp`)
  );
}

pub.get('/:segmen', (req, res, next) => {
  const segmen = segmenDariUrl(req.params.segmen);
  if (!segmen) return next(); // bukan tab → 404
  tampilkan(res, segmen);
});

pub.get('/:segmen/:set', (req, res, next) => {
  const segmen = segmenDariUrl(req.params.segmen);
  if (!segmen) return next();
  tampilkan(res, segmen, req.params.set);
});
