This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Perfecto, aquí tienes una **descripción profesional para tu repositorio de GitHub** que explica el proyecto, cómo usarlo y qué se aprende:

---

## Mini Pasarela de Pagos – Webhook y Tokenización (Demo)

Este proyecto es una **simulación de un flujo de pasarela de pagos** usando Node.js y Next.js, ideal para aprender conceptos clave de fintech y desarrollo seguro de APIs.

### 🔹 Qué hace

* Envía un **POST request** con datos de pago a un endpoint (`/api/webhook`).
* Genera un **HMAC (firma digital)** para garantizar que el payload sea seguro y auténtico.
* Simula la **tokenización de tarjetas** para proteger datos sensibles.
* Responde con un objeto JSON que incluye:

  * `id` del pago
  * `tokenTarjeta` (simulado)
  * `estado` del pago
  * `monto`, `moneda`, y fecha de creación

---

### 🔹 Qué puedes aprender con este flujo

1. **Webhooks:** cómo recibir y procesar eventos automáticos desde un servicio externo.
2. **Seguridad con HMAC:** validar integridad y autenticidad de los datos enviados.
3. **Tokenización:** reemplazar datos sensibles por tokens seguros (simulación de PCI DSS).
4. **Consumo de APIs con Node.js y fetch:** enviar requests POST con headers y body JSON.
5. **Variables de entorno con dotenv:** manejar secretos sin exponerlos en el código.
6. **Pruebas con Postman:** enviar requests manualmente y verificar la respuesta del servidor.

---

### 🔹 Cómo usarlo

1. Clonar el repositorio y moverse al directorio:

```bash
git clone <repo_url>
cd mini-pasarela-next
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env.local` con tu secreto de webhook:

```
WEBHOOK_SECRET=mi_secreto_webhook_123
```

4. Ejecutar el script para enviar un pago de prueba:

```bash
WEBHOOK_SECRET=mi_secreto_webhook_123 node send-webhook.js
```

5. Ver la respuesta en consola o usar **Postman** para probar manualmente:

* URL: `http://localhost:3000/api/webhook`
* Method: POST
* Headers:

  * `Content-Type: application/json`
  * `x-signature: <valor de sig que imprime send-webhook.js>`
* Body (raw JSON):

```json
{"idPago":1,"estadoBanco":"APROBADO"}
```

---

Si quieres, puedo hacer **una versión aún más resumida y lista para GitHub**, con emojis y bullets cortos, que quede atractiva y profesional para que cualquier reclutador la lea rápido.

¿Quieres que haga eso?

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
