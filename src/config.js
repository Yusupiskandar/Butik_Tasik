import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  root,
  port: Number(process.env.PORT) || 3005,
  namaButik: process.env.NAMA_BUTIK || 'Butik Tasik',
  waNumber: (process.env.WA_NUMBER || '').replace(/\D/g, ''),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
  dbPath: path.resolve(root, process.env.DB_PATH || 'data/butik.db'),
};

// kode = kode internal di database, url = bagian link yang terlihat (mis. /anak-perempuan/ceria).
export const SEGMEN = [
  { kode: 'wanita', url: 'wanita', label: 'Wanita' },
  { kode: 'pria', url: 'pria', label: 'Pria' },
  { kode: 'anak_pr', url: 'anak-perempuan', label: 'Anak Perempuan' },
  { kode: 'anak_lk', url: 'anak-laki-laki', label: 'Anak Laki-laki' },
  { kode: 'keluarga', url: 'keluarga', label: 'Keluarga' },
];
