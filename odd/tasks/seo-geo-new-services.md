# seo-geo-new-services

Branch: `feat/seo-geo-new-services` (from `main` at `fb0d78a`). Started 2026-10-07.

## Objective

Make the HisTech marketing site rank and get cited (SEO / AEO / GEO) for three offerings that
have no content today, fix the metadata defects found in the audit, and remove the client
Escort Security Services (ESS) from the site.

## Problem and why

- Teltonika is only an unlinked logo; there is no copy on 4G/LTE routers.
- IT outsourcing and ticket-based support exist only as a `noindex` portal.
- Road-safety regulation (PESV) solutions are not mentioned anywhere.
- Page titles render the brand suffix twice; `llms.txt` and `robots` are stale.

## Scope

In: `frontend/` marketing pages, metadata helpers, `llms.txt`, robots, nav/footer data.
Out: backend, portal behaviour, deploy, push/PR (user decisions).

## Constraints

- Site copy in neutral professional Spanish (es-CO), matching the existing pages.
- Never name ESS / Escort or any client on the road-safety page.
- Teltonika wording: "distribuidor" only. No "autorizado" / "oficial" until the owner confirms.
- No invented figures, certifications, prices or client names.

## TDD and checks

- Strict TDD is enabled in the user's global config, but the project has **no test runner and
  no test script** (`frontend/package.json`). No runner is invented; RED/GREEN is not available.
- Checks per task, run in `frontend/`: `npm run typecheck`, `npm run lint`, `npm run build`.

## Review

Receipt-driven development: status unreadable (`gentle-ai`: permission denied). No native
review started. Parent re-runs the checks and reads the diff before closing each task.

## Tasks

- [ ] T1 Remove Escort Security Services from the client marquee and delete its logo.
  Route: inline (one mechanical file + asset delete).
- [ ] T2 Metadata fixes: duplicated `| HISTECH` title suffix, keyword-bearing titles and
  descriptions for service pages, robots policy for AI crawlers and `/portal`, `llms.txt` refresh.
  Route: delegated writer (2+ non-trivial files).
- [ ] T3 New service pages `/teltonika-colombia`, `/outsourcing-ti`, `/seguridad-vial-pesv`
  following the `servicesContent` pattern; add to `services[]`, nav, footer, OfferCatalog,
  `BRAND_ENTITIES`, `llms.txt`; Brand markup for Teltonika.
  Route: delegated writer (2+ non-trivial files).

## Acceptance criteria

- No "Escort" / "ESS" string or asset remains in `frontend/`.
- Rendered `<title>` carries the brand once.
- The three new routes build, appear in the sitemap and `llms.txt`, and emit Service, WebPage,
  BreadcrumbList and FAQPage JSON-LD.
- typecheck, lint and build pass.

## Delivery

Strategy: `ask-on-risk`. Forecast: about 500-600 authored lines, mostly page copy in T3.

## Progress and evidence

(updated per task)

## Open items for the owner

- Is HisTech an authorized Teltonika distributor (changes wording)?
- Real LinkedIn / Facebook / X URLs for `sameAs`; the current X URL looks like a placeholder.
- Google Search Console / Bing verification codes.
