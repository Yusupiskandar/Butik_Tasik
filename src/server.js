import path from 'node:path';
import express from 'express';
import { config, SEGMEN } from './config.js';
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

app.listen(config.port, () => {
  console.log(`${config.namaButik} berjalan di http://localhost:${config.port}`);
});
