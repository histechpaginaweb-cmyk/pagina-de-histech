# HISTECH — Plataforma Web Corporativa

Sitio web enterprise de **HISTECH Tecnología**, construido con Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS y Framer Motion. Diseño premium dark-first inspirado en Microsoft Azure, Cloudflare, Stripe y CrowdStrike.

## 🚀 Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
- **UI:** React 19 + TypeScript + Tailwind CSS
- **Animaciones:** Framer Motion + canvas de red neuronal
- **Formularios:** React 19 `useActionState` + Zod (validación) + Resend (email)
- **Blog:** MDX (`next-mdx-remote`) + gray-matter + reading-time
- **SEO:** Metadata API, JSON-LD (Organization, Breadcrumb, FAQ, BlogPosting), sitemap y robots dinámicos, OG image generada
- **Analytics:** Vercel Analytics + Speed Insights

## 📦 Comandos

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo (http://localhost:3000)
npm run build      # build de producción
npm run start      # servir build
npm run typecheck  # verificar tipos
```

## 🔑 Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```
NEXT_PUBLIC_SITE_URL=https://histech.com.co
RESEND_API_KEY=re_xxx          # https://resend.com/api-keys
CONTACT_TO_EMAIL=consultor@histech.com.co
CONTACT_FROM_EMAIL=Histech Web <web@histech.com.co>
```

> Sin `RESEND_API_KEY` el formulario funciona en modo "demo" (registra el lead en consola y muestra confirmación). Al configurar Resend, envía correos reales.

## 🗂️ Estructura

```
src/
├── app/                    # rutas (App Router)
│   ├── actions/            # server actions (contacto)
│   ├── blog/               # blog: listado + [slug]
│   ├── industrias/         # índice + [slug] (SSG, 9 sectores)
│   ├── <servicios>/        # 10 landings de servicio
│   ├── layout.tsx          # layout raíz (fuentes, header, footer, JSON-LD)
│   ├── page.tsx            # home (15 secciones)
│   ├── sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx
│   └── ...                 # nosotros, contacto, agenda, resultados, aliados, laboratorio-ia, legal
├── components/
│   ├── brand/              # logo
│   ├── blog/               # componentes MDX
│   ├── forms/              # formulario de contacto
│   ├── layout/             # header, footer, whatsapp
│   ├── sections/           # secciones reutilizables del home
│   ├── templates/          # plantilla de página de servicio
│   ├── ui/                 # primitivos (button, badge, section, icon, reveal, breadcrumbs)
│   └── visuals/            # aurora, red neuronal (canvas)
├── content/blog/           # artículos MDX
└── lib/                    # site config, contenido, SEO, datos de servicios/industrias
```

## 🎨 Sistema de diseño

| Token | Color |
|-------|-------|
| Electric Purple (primary) | `#5B3FD6` |
| Tech Blue (secondary) | `#295DFF` |
| Neon Cyan (accent) | `#00D9FF` |
| Deep Space (dark) | `#0F172A` |
| Tech Gray | `#64748B` |

Tipografías: **Inter** (texto) + **Space Grotesk** (display).

## ⚡ Performance & Accesibilidad

- Animaciones respetan `prefers-reduced-motion`
- Canvas pausa fuera de viewport (IntersectionObserver)
- Foco visible (WCAG 2.2), skip-link, labels y aria
- Fuentes con `display: swap`, headers de seguridad en `next.config.mjs`

## 🚢 Deploy

Optimizado para **Vercel** (Root Directory = `frontend`). Guía completa de
despliegue (frontend + backend + Cloudflare R2) en [`../DEPLOY.md`](../DEPLOY.md).
