// pages/api/webhook.js
import helmet from 'helmet';
import crypto from 'crypto';

// Nota: compartimos el arreglo "pagos" simulando que es accesible.
// Así que guardaremos/consultaremos en memoria dentro de este archivo también.
// Para simplicidad en demo, re-creamos el array local (ideal: DB compartida).
let pagos = []; // En producción usar DB; aquí es para demo únicamente

function usarHelmet(req, res) {
  return new Promise((resolve) => {
    helmet()(req, res, () => resolve());
  });
}

function verificarFirmaHMAC(secret, payloadRaw, signatureHeader) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadRaw, 'utf8');
  const digest = hmac.digest('hex');
  // comparar constantes en tiempo (crypto.timingSafeEqual) -> convertir buffers
  try {
    const sigBuf = Buffer.from(signatureHeader, 'hex');
    const digBuf = Buffer.from(digest, 'hex');
    if (sigBuf.length !== digBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, digBuf);
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  await usarHelmet(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Raw body para verificar HMAC: Next ya parsea JSON, pero para HMAC es ideal usar raw body.
  // Aquí supondremos que Postman envía JSON y usamos JSON.stringify para recrear payload.
  const payload = req.body || {};
  const payloadRaw = JSON.stringify(payload);

  const signature = req.headers['x-signature'] || req.headers['x-hub-signature'] || '';
  const secret = process.env.WEBHOOK_SECRET || '';

  if (!secret) {
    return res.status(500).json({ error: 'Webhook secret no configurado' });
  }

  const ok = verificarFirmaHMAC(secret, payloadRaw, signature);

  if (!ok) {
    return res.status(401).json({ error: 'Firma HMAC inválida' });
  }

  // Aquí actualizamos/creamos pago según el payload
  const { idPago, tokenTarjeta, estadoBanco } = payload;

  // Buscar pago en "pagos" (demo) por id
  let pago = null;
  if (idPago) pago = pagos.find(p => p.id === Number(idPago));
  if (!pago && tokenTarjeta) pago = pagos.find(p => p.tokenTarjeta === tokenTarjeta);

  if (!pago) {
    // En demo: si no existe, creamos un registro simple (en real: fallback)
    const nuevo = {
      id: pagos.length + 1,
      tokenTarjeta: tokenTarjeta || 'tok_desconocido',
      monto: payload.monto || 0,
      moneda: payload.moneda || 'COP',
      estado: estadoBanco || 'APROBADO',
      creadoEn: new Date().toISOString()
    };
    pagos.push(nuevo);
    return res.status(201).json({ message: 'Pago creado por webhook (demo)', data: nuevo });
  }

  pago.estado = estadoBanco || 'APROBADO';
  pago.actualizadoEn = new Date().toISOString();

  return res.json({ message: 'Pago actualizado por webhook', data: pago });
}

