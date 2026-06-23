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
