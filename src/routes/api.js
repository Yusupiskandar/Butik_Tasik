import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { SEGMEN } from '../config.js';
import { getCollection, listLooks, getLook, priceCart } from '../services/catalog.js';
import { buildWhatsAppMessage, whatsAppLink } from '../services/whatsapp.js';

export const api = Router();
const kodeSegmen = SEGMEN.map((s) => s.kode);

api.get('/collections/:slug/looks', (req, res) => {
  const collection = getCollection(req.params.slug);
  if (!collection) return res.status(404).json({ error: 'Koleksi tidak ditemukan' });
  const segmen = kodeSegmen.includes(req.query.segmen) ? req.query.segmen : 'wanita';
  res.json({ collection, segmen, looks: listLooks(collection.id, segmen) });
});

api.get('/looks/:id', (req, res) => {
  const look = getLook(Number(req.params.id));
  if (!look) return res.status(404).json({ error: 'Look tidak ditemukan' });
  res.json(look);
});

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.number().int().positive(),
        qty: z.number().int().min(1).max(99),
        warna: z.string().max(40).optional(),
        ukuran: z.string().max(20).optional(),
        peran: z.string().max(40).optional(),
      })
    )
    .min(1)
    .max(100),
  nama: z.string().max(80).optional(),
  catatan: z.string().max(300).optional(),
});

api.post('/checkout/whatsapp', (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Data keranjang tidak valid' });

  const cart = priceCart(parsed.data.items);
  if (cart.baris.length === 0) return res.status(400).json({ error: 'Keranjang kosong' });

  const message = buildWhatsAppMessage(cart, parsed.data);
  db.prepare('INSERT INTO orders_log (isi_json, total) VALUES (?, ?)').run(JSON.stringify(cart.baris), cart.total);
  res.json({ total: cart.total, message, url: whatsAppLink(message) });
});
