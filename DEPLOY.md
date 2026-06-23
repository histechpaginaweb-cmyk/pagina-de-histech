# Despliegue HISTECH — Frontend en Vercel + Backend en Render

Arquitectura (sin base de datos):

```
Navegador ──> Frontend (Next.js, Vercel) ──fetch──> Backend (Express, Render)
                                                       │
                                          Cloudflare R2 ← products.json (textos)
                                                        ← imágenes de las tarjetas
```

El carrusel de productos de la home pide los datos al backend. El panel para
administrarlos vive en `https://TU-BACKEND.onrender.com/admin` (usuario y clave).
Todo se guarda en un único bucket de Cloudflare R2: los textos en un `products.json`
y las imágenes como archivos. No hay base de datos.

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
