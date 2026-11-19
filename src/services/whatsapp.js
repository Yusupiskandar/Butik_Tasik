import { config } from '../config.js';
import { formatRupiah } from './format.js';

export function buildWhatsAppMessage({ baris, total }, { nama, catatan } = {}) {
  const lines = [`Assalamu'alaikum ${config.namaButik}, saya ingin memesan:`, ''];
  baris.forEach((b, i) => {
    const detail = [b.peran, b.warna, b.ukuran].filter(Boolean).join(' · ');
    lines.push(`${i + 1}. ${b.nama}${detail ? ` (${detail})` : ''}`);
    lines.push(`   ${b.qty} x ${formatRupiah(b.harga)} = ${formatRupiah(b.subtotal)}`);
  });
  lines.push('', `Total: ${formatRupiah(total)}`);
  if (nama) lines.push(`Nama: ${nama}`);
  if (catatan) lines.push(`Catatan: ${catatan}`);
  lines.push('', 'Mohon info ketersediaan dan ongkirnya. Terima kasih.');
  return lines.join('\n');
}

export function whatsAppLink(message) {
  return `https://wa.me/${config.waNumber}?text=${encodeURIComponent(message)}`;
}
