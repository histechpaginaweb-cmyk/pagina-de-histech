# Feature: tienda-catalogo

Locator: `odd/tasks/tienda-catalogo.md` · Engram mirror: `odd/tienda-catalogo/tasks` (project `web-histech`)
Created: 2026-10-08

## Objective

Publish a product catalog of physical networking equipment at `/tienda`, inside the existing
HisTech site and brand, where visitors browse products and contact a HisTech advisor by
WhatsApp or phone. Products are managed from the existing admin and carry rich SEO metadata.

## Problem and why

HisTech is growing into an ecosystem of services and wants to offer physical products. Today
the site has no catalog: "products" are only home-carousel cards stored as one JSON file in R2.
A catalog under the same domain inherits the site's search authority and design system.

## Scope

In scope:
- Catalog data model (products, categories, brands) in the existing Postgres (Neon) via Prisma.
- Public read API and admin CRUD API in the existing Express backend.
- Catalog management in the existing `/admin` (backend `public/admin`).
- Public pages: `/tienda`, `/tienda/[categoria]`, `/tienda/producto/[slug]`.
- Advisor contact: WhatsApp with prefilled message, phone link, quote request form.
- SEO: per-product metadata, JSON-LD, sitemap, `llms.txt`.
- Navigation entry points from header and footer.

Out of scope (later phases): cart, checkout, online payment, shipping, multi-vendor,
customer accounts, stock sync.

## Decisions (owner-confirmed 2026-10-08)

- Catalog lives at `/tienda` in the existing Next.js app, not a separate app or subdomain.
- Prices are shown. Prices are stored and displayed **excluding VAT** ("Precio sin IVA"), in COP.
- Prices may be hidden later: support a global "show prices" setting plus a per-product
  "consult price" flag. Hidden price renders "Consultar precio" and omits `Offer` price data.
- No purchase flow: every product leads to an advisor (WhatsApp / phone / quote form).

## Constraints

- Brand: reuse existing tokens and components (`tailwind.config.ts`, `components/ui`,
  `components/layout`, `components/sections`). No new colors or fonts.
- Contact data comes only from `siteConfig.contact` in `frontend/src/lib/site.ts`.
- `mainNav` derives from `services.slice(...)`; do not add the store to the `services` array.
- UI copy is Spanish (neutral/professional), matching the existing site. Code, identifiers and
  comments are English.
- The existing home carousel products (`lib/products.ts`, `GET /api/products`) keep working unchanged.
- Never read or print `.env` values. Never run migrations or seeds against a remote database;
  migrations are authored as files and applied by the owner after confirmation.
- Repository policy: commit directly on `main`, no branches or PRs. Do not push (push deploys to production).
- Commits: Conventional Commits, no AI attribution lines.
- Never invent product data or prices. Seed products without a confirmed price use "consult price".

## TDD

- Mode: strict TDD enabled. Source: user global configuration (`Strict TDD Mode: enabled`).
- Runner: none existed at feature start. T1 adds them: frontend `vitest` (`npm test` in `frontend/`),
  backend Node built-in runner (`npm test` -> `node --test` in `backend/`).
- Each behavior: observed RED, then GREEN, then REFACTOR. Record observed evidence only.

## Delivery

- Forecast: about 2,500-3,500 authored changed lines, well over the 400-line budget.
- Strategy: `exception-ok`. Reason: owner policy for this repo is direct commits on `main`
  with no pull requests, so there is no PR to slice. Work is still split into work-unit commits per task.
- Review: receipt-driven development is `off` (global, user-decided). Ordinary checks apply.

## Data contract (shared by backend and frontend)

Product: `id`, `slug` (unique), `name`, `brandId`, `categoryId`, `model`, `sku` (unique, optional),
`shortDescription`, `description` (markdown), `specs` (ordered list of `{label, value}`),
`images` (ordered list of `{url, alt}`), `datasheetUrl`, `priceCop` (integer, VAT excluded, nullable),
`consultPrice` (bool), `availability` (`in_stock` | `on_request` | `out_of_stock`),
`priceUpdatedAt`, `status` (`draft` | `published`), `featured` (bool), `seoTitle`, `seoDescription`,
`createdAt`, `updatedAt`.

Category: `id`, `slug` (unique), `name`, `description`, `seoTitle`, `seoDescription`, `sortOrder`.
Brand: `id`, `slug` (unique), `name`, `logoUrl`.
Settings: `showPrices` (bool, default true).

Public API (published products only):
- `GET /api/catalog/products?category=&brand=&q=&page=&pageSize=` -> `{ items, total, page, pageSize }`
- `GET /api/catalog/products/:slug` -> product with `brand`, `category`, `related`
- `GET /api/catalog/categories`, `GET /api/catalog/brands`, `GET /api/catalog/settings`

Admin API (existing admin JWT cookie): CRUD under `/api/admin/catalog/{products,categories,brands}`,
`PATCH /api/admin/catalog/products/:id` for quick price/availability edits,
`PUT /api/admin/catalog/settings`, plus image and datasheet upload reusing the existing R2 upload.

## Tasks

- [x] **T1 Test tooling.** Add vitest to `frontend/` and a `node --test` script to `backend/`,
  each with one passing smoke test. Route: delegated (writer, backend+frontend config).
  Checks: `npm test` in both packages.
- [x] **T2 Catalog data model.** Prisma models and an authored migration (not applied), a catalog
  repository behind an interface, validation, slug generation, price rules (VAT excluded,
  `consultPrice`, `showPrices`). Route: delegated. Checks: backend `npm test`, `prisma validate`.
- [x] **T3 Catalog API.** Public read endpoints (published only, filters, search, pagination) and
  admin CRUD/patch/settings/upload endpoints behind existing admin auth. Route: delegated.
  Checks: backend `npm test`.
- [x] **T4 Admin UI.** Catalog section in the existing admin: products, categories, brands,
  quick price/availability edit, publish/draft, global show-prices toggle. Route: delegated.
  Checks: backend `npm test`; automated headless-browser walkthrough done by the writer; manual owner walkthrough pending.
- [ ] **T5 Public catalog pages.** Data layer (ISR), `/tienda`, `/tienda/[categoria]`,
  `/tienda/producto/[slug]`, product card, filters, gallery, specs table, price block,
  header/footer entry points. Route: delegated. Checks: frontend `npm test`, `npm run typecheck`,
  `npm run lint`, `npm run build`.
- [ ] **T6 Advisor contact.** WhatsApp prefilled-message builder, phone link, quote request form
  reusing the contact action with product context. Route: delegated. Checks: as T5.
- [ ] **T7 SEO.** Per-product and per-category metadata, JSON-LD `Product`/`Offer`
  (VAT-excluded price specification)/`BreadcrumbList`/`ItemList`, sitemap entries, `llms.txt`.
  Route: delegated. Checks: as T5.
- [ ] **T8 Seed and docs.** Idempotent seed with initial categories/brands and the products that
  have real source material (Teltonika RUT956, RUT200) as drafts with "consult price";
  README/DEPLOY notes for migration and seed. Route: delegated. Checks: backend `npm test`.

## Acceptance criteria

- A visitor reaches `/tienda` from header and footer, filters by category and brand, searches,
  and opens a product page with gallery, specs, price without VAT (or "Consultar precio").
- Each product page offers WhatsApp (message names the product, reference and URL), phone and quote form.
- An admin creates, edits, publishes and unpublishes products, categories and brands, uploads
  images, edits price/availability quickly, and toggles price visibility globally.
- Draft products never appear publicly, in the sitemap, or in structured data.
- Product pages emit valid `Product` JSON-LD; price data is present only when the price is visible.
- The existing site, home carousel, portal and admin features keep working.

## Progress

| Task | Status | Route | Commit | Evidence |
|------|--------|-------|--------|----------|
| T1 | done | delegated | 4190f45 | frontend `npm test` 2 pass, `typecheck` clean; backend `npm test` pass |
| T2 | done | delegated | 490ab84 | RED (module missing) then GREEN; backend 59 tests pass; `prisma validate` ok; migration generated offline, not applied |
| T3 | done | delegated | f47ff40 | RED (module missing) then GREEN; backend 75 tests pass incl. HTTP router tests with fake admin and fake uploader |
| T4 | done (owner walkthrough pending) | delegated | 303c6e6 | RED then GREEN for pure helpers; backend 88 tests pass; headless Edge drove create/quick-edit/publish/settings flow against in-memory API |
| T5 | pending | delegated | - | - |
| T6 | pending | delegated | - | - |
| T7 | pending | delegated | - | - |
| T8 | pending | delegated | - | - |

Running authored-line count: about 3,361 (T1 38, T2 1,627, T3 558, T4 1,138; lockfile and generated SQL excluded; tests included)

## Pending owner actions

- Apply the catalog migration to the production database (after review, with confirmation).
  File: `backend/portal/prisma/migrations/20261008000000_catalog/migration.sql` (additive: 2 enums, 4 tables, indexes, 2 FKs).
  WARNING: `backend/render.yaml` runs `npm run portal:push` (prisma db push) on every deploy, so pushing `main` also creates
  these tables in production without this file being used. The tables live in the Portal's Neon database (PORTAL_DATABASE_URL).
- Provide product content: photos, specs, prices.
- Push `main` to deploy (owner decision).

## Next step

T5-T7 (frontend) with one writer; T8 seed and docs after the migration is applied.
