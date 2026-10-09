# HISTECH — Monorepo

Plataforma web corporativa de **HISTECH Tecnología**. Dos aplicaciones en un mismo
repositorio:

```
.
├── frontend/   → Sitio web (Next.js 15) · se despliega en Vercel
├── backend/    → API de productos + panel /admin (Express) · se despliega en Render
└── DEPLOY.md   → Guía de despliegue paso a paso
```

- **frontend/** — el sitio público. El carrusel de productos lee del backend; si el
  backend no está disponible, usa 6 productos por defecto. Ver [`frontend/README.md`](frontend/README.md).
- **backend/** — API + panel de administración (`/admin`) para gestionar las tarjetas
  del carrusel. Persistencia 100 % en **Cloudflare R2** (textos en `products.json` +
  imágenes). Sin base de datos. Ver [`backend/README.md`](backend/README.md).

## Tienda (catálogo)

El sitio incluye un catálogo de productos en `/tienda` (categorías, marcas, búsqueda, ficha
de producto, contacto con asesor por WhatsApp/teléfono/cotización y SEO con JSON-LD).

- **Datos:** Postgres del Portal (Prisma, modelos `Catalog*`) + imágenes en R2.
- **Backend:** módulo `backend/catalog/` — API pública `GET /api/catalog/...` (solo publicados)
  y API admin `/api/admin/catalog/...`. Se gestiona desde `/admin`.
- **Frontend:** `frontend/src/app/tienda/`, `frontend/src/lib/catalog/` (lógica pura con tests).
- **Precios:** en COP **sin IVA**; un interruptor global y una casilla por producto permiten
  mostrar "Consultar precio". Ver [`DEPLOY.md`](DEPLOY.md) sección 7 (esquema, seed y precios).
- **Tests:** `cd backend && npm test` y `cd frontend && npm test`.

## Desarrollo local

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev      # http://localhost:4000

# Terminal 2 — frontend
cd frontend && npm install && npm run dev     # http://localhost:3000
```

## Despliegue

Frontend → **Vercel** (Root Directory = `frontend`).
Backend → **Render** (Root Directory = `backend`).
Almacenamiento → **Cloudflare R2**.

Pasos detallados en [`DEPLOY.md`](DEPLOY.md).
