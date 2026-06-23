# HISTECH — Backend (API de productos + admin)

Node + Express. **Datos:** Neon (Postgres). **Imágenes:** Cloudinary.
Pensado para desplegar en **Render** (Root Directory: `backend`).

## Endpoints
- `GET  /api/products` — público; lo consume el frontend (Vercel).
- `POST /api/admin/login` — `{ user, password }` → cookie de sesión.
- `POST /api/admin/logout`
- `GET  /api/admin/me` — valida sesión.
- `GET  /api/admin/products` — listar (admin).
- `POST /api/admin/products` — crear (admin).
- `PUT  /api/admin/products/:id` — actualizar (admin).
- `DELETE /api/admin/products/:id` — eliminar (admin).
- `POST /api/admin/upload` — subir imagen a Cloudinary (multipart `image`) → `{ url }`.
- `GET  /admin` — panel web de administración.

## Variables de entorno
Ver `.env.example`. En Render se ponen en *Environment*.

## Local
```bash
cp .env.example .env   # rellena los valores
npm install
npm run dev            # http://localhost:4000
```

La tabla `products` y los 6 productos seed se crean solos en el primer arranque.

> Guía completa de despliegue (Neon + Cloudinary + Render + Vercel) en
> [`../DEPLOY.md`](../DEPLOY.md).
