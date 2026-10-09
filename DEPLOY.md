# Despliegue HISTECH — Frontend en Vercel + Backend en Render

Arquitectura:

```
Navegador ─> Frontend (Next.js, Vercel) ─fetch─> Backend (Express, Render)
                                                    │
                                       Cloudflare R2 ← products.json + imágenes (sitio)
                                                    │
                    Portal de Soporte ──────────────┤
                    (mismo backend,       Neon (Postgres) ← empresas, usuarios,
                     ruta /api/portal)                       equipos, tickets, historial
                                              Resend ← correos de notificación
```

- **Sitio corporativo:** el carrusel/blog/casos leen del backend; se guardan en un bucket
  de Cloudflare R2 (sin base de datos). Panel en `https://TU-BACKEND.onrender.com/admin`.
- **Portal de Soporte Empresarial** (módulo nuevo): vive en el **mismo backend** bajo
  `/api/portal`, con **base de datos propia en Neon (Postgres)** y correos por **Resend**.
  Configúralo en la **sección 6** de esta guía.

---

## 0) Requisito: subir el código a GitHub

Vercel y Render despliegan desde un repositorio. Si aún no lo tienes en GitHub:

```bash
git init
git add .
git commit -m "HISTECH: web + backend de productos"
# crea un repo en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/histech.git
git push -u origin main
```

> El frontend (`/frontend`) y el backend (`/backend`) están en el **mismo repo**
> (monorepo). Vercel usará la carpeta `frontend`; Render usará la carpeta `backend`.

---

## 1+2) Almacenamiento — Cloudflare R2 (gratis)

Un solo servicio guarda **todo**: los textos de las tarjetas (`products.json`) y
las imágenes. No hace falta base de datos.

1. Entra a https://dash.cloudflare.com → **R2** (acepta los términos; pide tarjeta
   pero el plan tiene capa gratuita generosa: 10 GB y sin costo de egreso).
2. **Create bucket** → nombre p. ej. `histech`. Anótalo (será `R2_BUCKET`).
3. Habilita el acceso público a las imágenes: entra al bucket → **Settings** →
   **Public access** → activa el subdominio **r2.dev**. Copia esa URL pública
   (algo como `https://pub-xxxxxxxx.r2.dev`); será `R2_PUBLIC_URL`.
   *(Para producción seria, Cloudflare recomienda un dominio propio, pero el r2.dev
   funciona para empezar.)*
4. Crea las credenciales S3: **R2** → **Manage R2 API Tokens** → **Create API Token**
   → permiso **Object Read & Write** sobre tu bucket. Al crearlo te muestra:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY` (solo se ve una vez, cópialo ya)
5. Tu **Account ID** está en la página principal de R2 (o en la URL del dashboard);
   será `R2_ACCOUNT_ID`.

> El backend crea el `products.json` con los 6 productos iniciales automáticamente
> la primera vez que alguien abre el carrusel o el panel.

---

## 3) Backend — Render (gratis)

1. Entra a https://render.com → **New +** → **Web Service** → conecta tu repo.
2. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
3. En **Environment** agrega estas variables:

   | Clave | Valor |
   |---|---|
   | `NODE_ENV` | `production` |
   | `R2_ACCOUNT_ID` | (paso 1+2, Account ID de Cloudflare) |
   | `R2_ACCESS_KEY_ID` | (paso 1+2) |
   | `R2_SECRET_ACCESS_KEY` | (paso 1+2) |
   | `R2_BUCKET` | nombre del bucket (ej. `histech`) |
   | `R2_PUBLIC_URL` | URL pública del bucket (ej. `https://pub-xxxx.r2.dev`) |
   | `ADMIN_USER` | el usuario que quieras (ej. `histech`) |
   | `ADMIN_PASSWORD` | una contraseña fuerte |
   | `JWT_SECRET` | una cadena larga aleatoria |
   | `FRONTEND_ORIGIN` | tu dominio de Vercel (lo tendrás en el paso 4; puedes ponerlo después) |

4. Deploy. Cuando termine tendrás una URL tipo
   `https://histech-backend.onrender.com`.
   - Verifica: abre esa URL → debe responder `{"ok":true,...}`.
   - Panel admin: `https://histech-backend.onrender.com/admin` → entra con
     `ADMIN_USER` / `ADMIN_PASSWORD`.

> **Nota plan Free de Render:** el servicio "se duerme" tras ~15 min sin uso y
> tarda unos segundos en despertar en la primera visita. Los datos NO se pierden
> (están en Cloudflare R2, no en Render).

---

## 4) Frontend — Vercel (gratis)

1. Entra a https://vercel.com → **Add New… → Project** → importa tu repo.
2. **Root Directory:** pulsa **Edit** y selecciona la carpeta **`frontend`**
   (importante: la app Next vive ahí, no en la raíz). Framework: **Next.js**
   (lo detecta solo).
3. En **Environment Variables** agrega:

   | Clave | Valor |
   |---|---|
   | `BACKEND_URL` | la URL de Render (paso 3), ej. `https://histech-backend.onrender.com` |
   | `NEXT_PUBLIC_SITE_URL` | tu dominio final, ej. `https://histech.com.co` |
   | `RESEND_API_KEY` | (opcional, para el formulario de contacto) |
   | `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | (opcional) |

4. Deploy. Obtendrás una URL `https://tu-proyecto.vercel.app`.
5. **Vuelve a Render** y pon esa URL en `FRONTEND_ORIGIN` (paso 3) → guarda
   (Render redeploya). Esto habilita CORS correctamente.

---

## 5) Probar el flujo completo

1. Abre el panel: `https://TU-BACKEND.onrender.com/admin` → inicia sesión.
2. Edita una tarjeta, **sube una imagen** y pulsa **Guardar**.
3. Abre tu sitio en Vercel → el carrusel muestra el cambio (puede tardar hasta
   ~60s por la caché; o redeploya el front para verlo al instante).

---

## 6) Portal de Soporte Empresarial — Base de datos, primer admin y correos

El portal usa **su propia base de datos (Neon)** y envía **correos con Resend**. Todo
corre en el **mismo backend de Render** (no hay que crear otro servicio).

### 6.1) Base de datos — Neon (gratis)

1. Entra a https://neon.tech → crea un **proyecto nuevo** (p. ej. `histech-portal`).
   > Recomendado: un proyecto **dedicado** al portal, separado de cualquier prueba.
2. Copia la **connection string** (Dashboard → *Connect* → incluye `?sslmode=require`).
   Será el valor de `PORTAL_DATABASE_URL`, por ejemplo:
   `postgresql://USUARIO:CLAVE@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
3. No hace falta crear tablas a mano: el despliegue de Render ejecuta
   `npm run portal:push`, que **crea/actualiza las tablas automáticamente**.

### 6.2) Variables del portal en Render (backend)

En Render → tu servicio → **Environment**, añade (además de las de la sección 3):

| Clave | Valor |
|---|---|
| `PORTAL_DATABASE_URL` | la connection string de Neon (6.1) |
| `PORTAL_JWT_SECRET` | cadena larga aleatoria (o deja que Render la genere) |
| `PORTAL_PUBLIC_URL` | tu dominio del sitio (ej. `https://histech.com.co`) — para los enlaces de los correos |
| `RESEND_API_KEY` | API key de Resend (paso 6.4) |
| `PORTAL_MAIL_FROM` | remitente en tu dominio, ej. `Soporte HISTECH <soporte@histech.com.co>` |
| `PORTAL_NOTIFY_EMAIL` | correo donde HISTECH recibe los avisos de tickets nuevos |
| `PORTAL_ADMIN_EMAIL` | correo del primer administrador (solo para el seed) |
| `PORTAL_ADMIN_USERNAME` | usuario del primer admin (ej. `admin`) |
| `PORTAL_ADMIN_PASSWORD` | contraseña del primer admin (mín. 8) |
| `PORTAL_ADMIN_NAME` | nombre del primer admin (ej. `Administrador HISTECH`) |

Guarda → Render redeploya y, en el build, sincroniza el esquema con Neon.

### 6.3) Crear el primer Administrador (una sola vez)

En Render → tu servicio → pestaña **Shell**, ejecuta:

```bash
npm run portal:seed
```

Crea la empresa interna de HISTECH y el primer administrador con los `PORTAL_ADMIN_*`.
Es **idempotente**: si ya existe, no lo duplica. (Alternativa: ejecutarlo en local
apuntando `PORTAL_DATABASE_URL` a la base de Neon de producción.)

### 6.4) Resend — correos en producción (paso a paso)

Los correos de notificación (ticket nuevo/asignado/actualizado/cerrado) salen del
backend con Resend. **Sin `RESEND_API_KEY` el portal funciona igual, pero no envía
correos** (los registra en el log). Para activarlos en producción:

1. **Crea la cuenta:** https://resend.com → *Sign up* (plan gratis: 3.000 correos/mes,
   100/día).
2. **Verifica tu dominio (obligatorio para escribir a tus clientes):**
   - Resend → **Domains** → **Add Domain** → escribe `histech.com.co`.
   - Resend mostrará unos **registros DNS** (verificación TXT + DKIM tipo CNAME y,
     según el caso, SPF/MX). Cópialos.
   - Entra al **panel DNS de tu dominio** (donde administras `histech.com.co`:
     Cloudflare, tu registrador, etc.) y **crea esos registros tal cual**.
   - Vuelve a Resend → **Verify**. Puede tardar de minutos a unas horas (propagación
     DNS). Debe quedar en **Verified**.
   > ⚠️ Si NO verificas un dominio, Resend solo permite enviar **a tu propio correo**
   > de la cuenta y desde `onboarding@resend.dev` (modo prueba). No sirve para enviar
   > a los correos de tus clientes.
3. **Crea la API Key:** Resend → **API Keys** → **Create API Key** → nombre
   `HISTECH Portal`, permiso *Sending access* → copia el valor `re_...`
   (**solo se ve una vez**).
4. **Define el remitente** en tu dominio verificado, p. ej. `soporte@histech.com.co`.
   Con nombre visible: `Soporte HISTECH <soporte@histech.com.co>`.
5. **Ponlo en Render** (6.2): `RESEND_API_KEY`, `PORTAL_MAIL_FROM`,
   `PORTAL_NOTIFY_EMAIL`, `PORTAL_PUBLIC_URL`. Guarda → redeploy.
6. **Prueba:** crea un ticket y ciérralo → deben llegar los correos (revisa *spam* la
   primera vez). En Resend → **Logs** ves cada envío y su estado.

> La misma `RESEND_API_KEY` sirve también para el formulario de contacto del sitio
> (variable `RESEND_API_KEY` en Vercel, sección 4). Es la misma cuenta.

### 6.5) Frontend (Vercel) — nada nuevo que configurar

El portal vive en `TU-DOMINIO/portal`. El sitio reenvía `/api/portal/*` al backend
usando la variable **`BACKEND_URL`** que ya configuraste en la sección 4 (no necesitas
una variable extra). Así las cookies de sesión quedan en tu dominio (seguro, sin CORS).

### 6.6) Verificar el portal en producción

1. Abre `https://TU-DOMINIO/portal/login` → entra con el admin del seed (6.3).
2. Crea una **empresa**, un **usuario** y un **equipo**.
3. Entra con ese usuario (en otro navegador o incógnito) y **crea un ticket**.
4. Como admin: **asigna, atiende y cierra**; descarga el **PDF** y un **reporte Excel**.
5. Revisa que lleguen los **correos** (paso 6.4) y el dashboard ejecutivo.

---

## 7) Tienda / Catálogo de productos

La tienda (`/tienda`) vive en el mismo sitio y lee del backend. Los productos, categorías y
marcas se guardan en la **base de datos del Portal (Neon, `PORTAL_DATABASE_URL`)** y se
administran desde `/admin` (sección Catálogo). Las imágenes y fichas técnicas usan el mismo R2.

### 7.1) Aplicar el esquema

Las tablas nuevas son aditivas (2 enums, 4 tablas: `catalog_products`, `catalog_categories`,
`catalog_brands`, `catalog_settings`).

- **Automático:** `render.yaml` ejecuta `npm run portal:push` en cada despliegue, así que al
  desplegar `main` Render crea las tablas solas.
- **Manual (revisado):** el SQL está en
  `backend/portal/prisma/migrations/20261008000000_catalog/migration.sql`. Aplícalo tú mismo
  (por ejemplo `npm run portal:migrate` con la URL correcta) **después de revisarlo y confirmar
  la base de datos de destino**.

Mientras las tablas no existan, la tienda muestra "Estamos preparando el catálogo" y el resto
del sitio no se ve afectado.

### 7.2) Cargar el catálogo inicial (seed)

```bash
cd backend
npm run catalog:seed
```

- Es **idempotente**: busca por `slug` y solo crea lo que falta; no pisa cambios hechos en el admin.
- Crea categorías, la marca Teltonika y dos productos (**RUT956** y **RUT200**) con datos
  tomados de las presentaciones de HISTECH, como **borrador** y con **"Consultar precio"**.
- Las fotos están en `frontend/public/tienda/`. Falta: precio, SKU y ficha técnica.
- Publica cada producto desde `/admin` cuando esté completo.
- Ejecútalo solo contra la base que quieras (usa `PORTAL_DATABASE_URL`).

### 7.3) Visibilidad de precios

- Los precios se guardan en **COP, sin IVA** y se muestran como "Precio sin IVA".
- **Interruptor global** (`/admin` > Catálogo > Ajustes): al desactivar "Mostrar precios en la tienda", todo el
  catálogo muestra "Consultar precio".
- **Por producto:** la casilla "Consultar precio" oculta solo ese precio.
- Un precio oculto tampoco aparece en el HTML, en los metadatos ni en los datos estructurados
  (JSON-LD). El cambio se refleja en el sitio en hasta ~60 segundos.

### 7.4) Variables

El frontend solo necesita `BACKEND_URL` (la misma del carrusel). Sin ella la tienda se
muestra vacía en lugar de fallar. Los datos de contacto (WhatsApp, teléfono) salen de
`frontend/src/lib/site.ts`.

---

## Desarrollo local (opcional)

**Backend:**
```bash
cd backend
cp .env.example .env      # rellena R2_*, ADMIN_*, JWT_SECRET
npm install
npm run dev               # http://localhost:4000  (admin en /admin)
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```
En `frontend/.env.local` pon `BACKEND_URL=http://localhost:4000` para que el
carrusel lea del backend local. Sin esa variable, usa los 6 productos seed.
