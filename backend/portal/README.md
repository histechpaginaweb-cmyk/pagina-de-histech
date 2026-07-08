# Portal de Soporte Empresarial HISTECH — Backend (módulo)

Módulo **independiente y aislado** dentro del backend de HISTECH. Toda la lógica
de negocio, autenticación, datos y (fases siguientes) tickets/reportes/PDF viven
aquí. Usa una **base de datos dedicada** (Neon Postgres) vía Prisma y se monta en
el backend existente bajo **`/api/portal`** sin tocar las rutas de productos/blog.

> Arquitectura desacoplada: el sitio Next.js (Vercel) es solo la interfaz de
> acceso/presentación y consume esta API mediante un *rewrite* mismo-origen.

## Estructura

```
portal/
├── prisma/schema.prisma     # Modelo de datos (BD dedicada)
├── lib/                     # prisma, jwt, password (bcrypt), http, serialize
├── middleware/              # auth (RBAC + tenant), validate (Zod)
├── validators/schemas.js    # Esquemas Zod (Fase 1)
├── routes/                  # auth, companies, users
├── seed.js                  # Crea el primer Admin HISTECH
└── index.js                 # Router raíz → se monta en server.js
```

## Puesta en marcha

### 1. Base de datos (Neon)
Crea un **proyecto nuevo** en [Neon](https://neon.tech) (exclusivo del portal) y
copia su *connection string*.

### 2. Variables de entorno
En `backend/.env` (local) o en Render (Environment) — ver `.env.example`:

```
PORTAL_DATABASE_URL=postgresql://...:...@...neon.tech/db?sslmode=require
PORTAL_JWT_SECRET=<cadena-larga-aleatoria>
PORTAL_ADMIN_EMAIL=admin@histech.com.co
PORTAL_ADMIN_USERNAME=admin
PORTAL_ADMIN_PASSWORD=<mínimo-8-caracteres>
PORTAL_ADMIN_NAME=Administrador HISTECH
```

### 3. Migrar y sembrar
```bash
cd backend
npm install                 # genera el cliente Prisma (postinstall)
npm run portal:migrate:dev  # crea/aplica la migración inicial (local)
#   en Render usa:  npm run portal:migrate   (prisma migrate deploy)
npm run portal:seed         # crea la empresa interna HISTECH + primer Admin
npm run dev                 # backend en http://localhost:4000
```

Herramientas útiles: `npm run portal:studio` (Prisma Studio), `npm run portal:push`
(sincroniza el esquema sin migración, útil en prototipado).

## API (Fase 1)

| Método | Ruta | Acceso |
|---|---|---|
| GET  | `/api/portal/health` | público |
| POST | `/api/portal/auth/login` | público |
| POST | `/api/portal/auth/logout` | sesión |
| GET  | `/api/portal/auth/me` | sesión |
| GET/POST | `/api/portal/companies` | Admin |
| GET/PUT  | `/api/portal/companies/:id` | Admin |
| PATCH | `/api/portal/companies/:id/status` | Admin |
| GET | `/api/portal/users` (`?companyId,?role,?q`) | Admin |
| GET/POST | `/api/portal/companies/:companyId/users` | Admin |
| GET/PUT | `/api/portal/users/:id` | Admin |
| PATCH | `/api/portal/users/:id/status` | Admin |
| POST | `/api/portal/users/:id/reset-password` | Admin |

Sesión: cookie httpOnly `histech_portal` (JWT con `userId`, `role`, `companyId`).
Contraseñas con **bcrypt**. Sin registro público: los usuarios solo los crea el
Administrador HISTECH.

## API (Fase 2 — Equipos y Tickets)

| Método | Ruta | Acceso |
|---|---|---|
| GET/POST | `/api/portal/companies/:companyId/assets` | Admin (cliente: GET de su empresa) |
| GET/PUT | `/api/portal/assets/:id` (incluye historial de tickets) | Admin (cliente: GET) |
| GET | `/api/portal/tickets` (filtros: status, category, priority, companyId, q…) | según rol |
| GET | `/api/portal/tickets/dashboard` (contadores + últimos) | según rol |
| POST | `/api/portal/tickets` | cliente/admin |
| GET | `/api/portal/tickets/:id` | según rol (cliente: solo los suyos) |
| PATCH | `/api/portal/tickets/:id/assign` · `/status` | Admin |
| POST | `/api/portal/tickets/:id/attend` · `/close` | Admin |
| POST | `/api/portal/tickets/:id/attachments` (multipart `images`, máx. 2) | según rol |

Adjuntos: **solo imágenes**, optimizadas con **sharp** (WebP, máx. 1600 px) y
almacenadas en R2 (`portal/tickets/`). Numeración de tickets `HT-AAAA-######`
atómica vía tabla `counters`. Cada cambio registra un evento en la línea de tiempo.

## Frontend (sitio Next.js)
Configura el *rewrite* mismo-origen con la variable **`PORTAL_API_URL`**:
- Local: `PORTAL_API_URL=http://localhost:4000`
- Producción (Vercel): `PORTAL_API_URL=https://<tu-backend>.onrender.com`

El portal vive en `/portal` (login, panel admin de Empresas y Usuarios).

## API (Fase 3 — Dashboard, Reportes, Notificaciones)

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/portal/dashboard/admin` (conteos, distribuciones, tiempos promedio, últimos) | Admin |
| GET | `/api/portal/reports/tickets.xlsx` (filtros: companyId, status, category, priority, assignedToId, assetId, from, to) | Admin |
| GET | `/api/portal/tickets/:id/pdf` (PDF de marca con logo, colores y pie corporativo) | según rol |

Notificaciones por **email** (Resend) en: nuevo ticket (→ HISTECH), asignado (→ técnico y cliente),
actualizado (→ cliente) y cerrado (→ cliente). Sin `RESEND_API_KEY` no se envían (se registran en consola)
y la operación no se ve afectada. Excel con **exceljs**; tiempos promedio calculados por SQL
(`startedAt-createdAt` atención, `closedAt-createdAt` resolución).

## Estado del módulo
- **Fase 1 (completada):** infraestructura + auth + Empresas + Usuarios.
- **Fase 2 (completada):** Equipos + Tickets (timeline, adjuntos optimizados, estados, atención, cierre, PDF) + dashboard del cliente + tabla admin con filtros.
- **Fase 3 (completada):** dashboard ejecutivo (tiempos promedio + distribuciones), reportes Excel y notificaciones por email.
