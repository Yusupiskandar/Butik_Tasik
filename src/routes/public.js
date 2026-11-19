import { Router } from 'express';
import { config, SEGMEN } from '../config.js';
import { getActiveCollection, listLooks, getLook } from '../services/catalog.js';

export const pub = Router();

// JSON aman untuk disisipkan ke dalam <script>.
const jsonAman = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

pub.get('/', (req, res) => {
  const collection = getActiveCollection();
  if (!collection) return res.status(503).send('Belum ada koleksi aktif. Jalankan: npm run seed');

  const segmen = SEGMEN.some((s) => s.kode === req.query.segmen) ? req.query.segmen : 'wanita';

  // Semua segmen dikirim sekaligus (datanya kecil) supaya pindah tab bisa tanpa reload halaman.
  const semua = Object.fromEntries(
    SEGMEN.map((s) => [s.kode, listLooks(collection.id, s.kode).map((l) => getLook(l.id))])
  );
  const looks = semua[segmen];
  const awal = Math.max(0, looks.findIndex((l) => l.slug === req.query.look));

  res.render('runway', {
    collection,
    segmen,
    looks,
    awal,
    dataJson: jsonAman({ segmen, semua, awal, waAktif: config.waNumber.length >= 10 }),
  });
});
