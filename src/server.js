import path from 'node:path';
import express from 'express';
import { config, SEGMEN } from './config.js';
import { db } from './db/index.js';
import { formatRupiah } from './services/format.js';
import { pub } from './routes/public.js';
import { api } from './routes/api.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(config.root, 'src/views'));
app.disable('x-powered-by');

app.locals.namaButik = config.namaButik;
app.locals.SEGMEN = SEGMEN;
app.locals.formatRupiah = formatRupiah;

app.use(express.json({ limit: '100kb' }));
// Saat development cache dimatikan supaya perubahan CSS/JS langsung terlihat.
const cacheStatis = process.env.NODE_ENV === 'production' ? '1h' : 0;
app.use(express.static(path.join(config.root, 'public'), { maxAge: cacheStatis }));
app.use('/uploads', express.static(path.join(config.root, 'uploads'), { maxAge: '7d' }));

app.use('/api', api);
app.use('/', pub);

app.use((req, res) => res.status(404).send('Halaman tidak ditemukan'));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send('Terjadi kesalahan di server');
});

// Server baru (database masih kosong): isi data koleksi contoh otomatis, supaya website langsung tampil.
if (db.prepare('SELECT COUNT(*) AS n FROM collections').get().n === 0) {
  console.log('Database masih kosong, mengisi data koleksi contoh...');
  await import('./db/seed.js');
}

app.listen(config.port, () => {
  console.log(`${config.namaButik} berjalan di http://localhost:${config.port}`);
});
