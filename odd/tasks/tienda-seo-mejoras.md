# Store SEO / GEO / AEO improvements

## Objective

People and AI answer engines reach HisTech store products by brand, by category question and by Google Shopping, not only by part number.

## Problem / why

The part-number SEO is live (c751b8e) and prices are IVA-included (f64189a). The SEO review left four gaps:

- `og:type` and `product:price:*` render as `<meta name>` instead of `<meta property>`, so Open Graph ignores them.
- There are no brand landing pages for "Ruijie" or "Reyee" queries.
- Category pages carry no FAQ content for AEO answers.
- There is no Google Merchant Center feed.

## Scope

- Frontend only (Next.js 15 App Router, `frontend/`), plus a backend change only if brand filtering is missing from the catalog API.
- Brand pages live at `/tienda/marca/[marca]` (ruijie, reyee), with metadata, JSON-LD (CollectionPage + Brand + ItemList + BreadcrumbList), a product grid, sitemap entries and links from the store.
- Category FAQ: visible FAQ plus FAQPage JSON-LD on `/tienda/[categoria]`, using static Spanish copy per known category slug. No FAQ for unknown slugs.
- Merchant feed: `/tienda/feed.xml`, a Google Shopping RSS 2.0 file.
  - It holds published, priced, price-visible products, with prices in IVA-included COP.
  - Fields: g:id, g:title, g:description, g:link, g:image_link, g:additional_image_link, g:price "N COP", g:availability, g:condition new, g:brand, g:mpn, g:product_type, g:identifier_exists.

## Constraints

- Strict TDD (vitest frontend, node --test backend). RED before GREEN.
- English code, comments and commits. Neutral Spanish UI copy.
- Commit to main, one commit per task. The push is the owner's decision.

## Acceptance criteria

- The product page HTML has exactly one `og:type` and it is `<meta property="og:type" content="product">`. The price tags also use `property`.
- `/tienda/marca/ruijie` and `/tienda/marca/reyee` render only their own products, are in the sitemap, and an unknown brand returns 404.
- Each known category page shows an FAQ and FAQPage JSON-LD whose text matches it.
- `/tienda/feed.xml` returns valid XML with one item per eligible product. Hidden-price or consult-price products are excluded.

## Checks

`cd frontend && npm test && npm run typecheck && npm run build`; `cd backend && npm test` if the backend is touched.

TDD: enabled (session config). Runners: vitest (frontend), node --test (backend).

## Tasks

- [x] T1: Fix og:type and product price meta to render as `property`. Route: delegated (writer).
- [ ] T2: Brand pages `/tienda/marca/[marca]` plus sitemap and links. Route: delegated (writer, 2+ files).
- [ ] T3: Category FAQ (visible plus FAQPage JSON-LD). Route: delegated (writer).
- [ ] T4: Google Merchant feed `/tienda/feed.xml`. Route: delegated (writer).

## Progress

- 2026-10-15: document created. Delivery strategy: ask-on-risk. Forecast is about 500 to 700 changed lines.
- 2026-10-15 T1 done: RED = 3 vitest failures (product-seo, seo tests); GREEN = 130 tests pass, typecheck ok. Built with a mock catalog backend; rendered product HTML has exactly one `<meta property="og:type" content="product"/>` plus property price tags (only og:type when price is hidden). Commit: 26a8be5.
