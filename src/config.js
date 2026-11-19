import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  root,
  port: Number(process.env.PORT) || 3000,
  namaButik: process.env.NAMA_BUTIK || 'Butik Tasik',
  waNumber: (process.env.WA_NUMBER || '').replace(/\D/g, ''),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
  dbPath: path.resolve(root, process.env.DB_PATH || 'data/butik.db'),
};

export const SEGMEN = [
  { kode: 'wanita', label: 'Wanita' },
  { kode: 'pria', label: 'Pria' },
  { kode: 'anak_pr', label: 'Anak Perempuan' },
  { kode: 'anak_lk', label: 'Anak Laki-laki' },
  { kode: 'keluarga', label: 'Keluarga' },
];
