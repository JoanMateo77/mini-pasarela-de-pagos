# Mini pasarela de pagos

Demo de backend que simula el flujo básico de una pasarela de pagos: recibir un pago, tokenizar la tarjeta y actualizar su estado con un webhook firmado con HMAC. Es un proyecto de aprendizaje sobre la seguridad de una API de pagos.

## Qué hace

- `POST /api/pago` recibe `tarjeta`, `monto`, `moneda` y `metodo` (opcional). Valida los campos obligatorios, reemplaza el número de tarjeta por un token y guarda el pago en estado `PENDIENTE`.
- `GET /api/pago` lista los pagos registrados (solo para pruebas).
- `POST /api/webhook` simula la notificación del banco. Verifica la firma HMAC-SHA256 del cuerpo y actualiza el estado del pago. Lo busca por `idPago` o por `tokenTarjeta`.
- Ambos endpoints aplican cabeceras de seguridad con `helmet`. Ante un método no soportado responden `405` con la cabecera `Allow`.

## Stack

- Next.js 15 (API Routes en `pages/api`)
- Módulo `crypto` de Node.js para HMAC
- `helmet` para cabeceras HTTP de seguridad

## Estructura

```
pages/api/
├── pago.js      # Registro y tokenización de pagos
└── webhook.js   # Webhook del banco con verificación HMAC
```

## Cómo correrlo

```bash
npm install
echo "WEBHOOK_SECRET=mi_secreto_de_prueba" > .env.local
npm run dev
```

Registrar un pago:

```bash
curl -X POST http://localhost:3000/api/pago \
  -H "Content-Type: application/json" \
  -d '{"tarjeta":"4111111111111111","monto":50000,"moneda":"COP"}'
```

Enviar un webhook firmado. La firma es el HMAC-SHA256, en hexadecimal, del cuerpo JSON compacto:

```bash
BODY='{"idPago":1,"estadoBanco":"APROBADO"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "mi_secreto_de_prueba" | awk '{print $NF}')
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-signature: $SIG" \
  -d "$BODY"
```

Si la firma no coincide, el webhook responde `401`. Si falta `WEBHOOK_SECRET`, responde `500`.

## Decisiones técnicas

- **Comparación de firmas en tiempo constante.** La firma se compara con `crypto.timingSafeEqual`, tras revisar que ambos buffers tengan la misma longitud. Así no se filtra información por diferencias de tiempo.
- **El secreto vive fuera del código.** `WEBHOOK_SECRET` se lee de variables de entorno y `.env*` está en `.gitignore`.
- **El número de tarjeta no se guarda.** El pago almacena solo el token generado.
- **Cabeceras de seguridad en cada respuesta.** `helmet` es un middleware de Express; aquí se adapta a las API Routes de Next.js con un pequeño envoltorio en promesa.

## Limitaciones

Es una demo, no un sistema listo para producción:

- Los pagos se guardan en memoria y se pierden al reiniciar. Además, `pago.js` y `webhook.js` tienen cada uno su propio arreglo, así que el webhook no ve los pagos creados en `/api/pago`. Si no encuentra el pago, crea un registro nuevo.
- La firma se calcula sobre `JSON.stringify(req.body)`, no sobre el cuerpo crudo de la petición. Si el remitente formatea el JSON de otra manera, la firma no coincide.
- El token se genera con `Math.random()`, no con un generador criptográfico ni con una bóveda de tokens.
- No valida el número de tarjeta (por ejemplo, con Luhn) ni el formato del monto.
- No tiene pruebas automatizadas ni interfaz web.

---

Hecho por [Joan Mateo Cardona](https://github.com/JoanMateo77).
