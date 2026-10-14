# Store prices in USD or COP

## Objective

Each catalog product carries its own price currency (`COP` or `USD`). Store cards, the product page and structured data show the amount with an explicit currency label, so USD-priced items are never mistaken for pesos.

## Problem / why

The Syscom import (128 Ruijie/Reyee products) has prices in USD for every item. Syscom only shows COP (USD x daily TRM) for 76 of them. The owner decided (2026-10-14):

- Items priced in USD stay in USD.
- Items Syscom publishes in COP stay in COP.
- Every card shows which currency applies.

Today the model only has `priceCop Int` (integer COP), which cannot hold USD cents.

## Scope

- Prisma: replace `priceCop Int?` with `price Decimal(14,2)?` plus `priceCurrency String @default("COP")` (`COP` | `USD`). Add a new migration that copies `priceCop` into `price`; the existing `20261008000000_catalog` migration is not edited.
- Backend: validation, pricing, service, the memory and Prisma repositories, the router payloads, the seed and the admin UI (currency selector next to price). The Prisma repository exposes `price` as a JS number.
- Frontend: types, price formatting with a currency label, card, product page and JSON-LD `priceCurrency`.
- Prices remain "sin IVA".

## Constraints

- Strict TDD: RED before GREEN, for both runners.
- No DB writes, no push. Commits go on `main` (repo policy: sole committer, direct to main).
- English for code, comments and commits. Spanish UI copy, matching the existing store.

## Acceptance criteria

- A product with `priceCurrency: "USD"` and `price: 71.19` renders `US$ 71,19` with a "USD" label on the card and the product page.
- A product in COP renders `$ 227.412` with a "COP" label.
- JSON-LD `priceCurrency` matches the product currency.
- Validation rejects unknown currencies and allows 2 decimals.
- Hidden-price and consult-price behaviour is unchanged.

## Checks

- Backend: `npm test` (node --test), in `backend/`.
- Frontend: `npm test` (vitest) and `npm run typecheck`, in `frontend/`.

TDD: enabled (session config "Strict TDD Mode: enabled"). Runners: node --test (backend), vitest (frontend).

## Tasks

- [x] T1: Model and backend support price + priceCurrency (schema, migration, validation, pricing, service, repositories, seed, admin UI) with tests. Route: delegated (2+ non-trivial files).
- [x] T2: Frontend shows the currency on the card, the product page and JSON-LD, with tests. Route: delegated (2+ non-trivial files).
- [x] T3: Update the Syscom preview mapping and verify on localhost. Route: inline (scratchpad script).

## Progress

- 2026-10-14: document created. Delivery strategy: ask-on-risk. Forecast is about 300 to 450 changed lines.
- 2026-10-14: T1 done in 07b7574 (backend 106/106 pass; RED observed first: 6 admin-utils failures plus pricing, validation, service, router, seed, prisma-repo tests). Migration `20261014000000_catalog_price_currency` added, not applied to any DB.
- 2026-10-14: T2 done in 76fa4b8 (frontend 83/83 pass, typecheck clean; RED observed first: 10 failures in price, contact and seo tests). WhatsApp advisor message now reads "<amount> <COP|USD> sin IVA".
- 2026-10-14: T3 done. The localhost preview (in-memory backend loaded with the Syscom import) shows `US$ 11,24 USD` on the cards and `$ 85.716 COP` on the product page.
- 2026-10-14: Owner decision: drop the 52 Syscom items that have no published price (44 "bajo pedido", 8 "Solicitar Distribución", including BRIEFCASERUIJIE). That leaves 76 products (48 Reyee, 28 Ruijie), all priced in COP. USD support stays available for future products.
- Next: the real import. Upload images to R2, apply both migrations to Neon, and seed the 76 products as published. Each of these needs explicit owner approval.
