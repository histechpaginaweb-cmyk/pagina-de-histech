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

- [x] T1 Remove Escort Security Services from the client marquee and delete its logo.
  Route: inline (one mechanical file + asset delete).
- [x] T2 Metadata fixes: duplicated `| HISTECH` title suffix, keyword-bearing titles and
  descriptions for service pages, robots policy for AI crawlers and `/portal`, `llms.txt` refresh.
  Route: delegated writer (2+ non-trivial files).
- [x] T3 New service pages `/teltonika-colombia`, `/outsourcing-ti`, `/seguridad-vial-pesv`
  following the `servicesContent` pattern; add to `services[]`, nav, footer, OfferCatalog,
  `BRAND_ENTITIES`, `llms.txt`; Brand markup for Teltonika.
  Route: delegated writer (2+ non-trivial files).
- [x] T4 Expand `/seguridad-vial-pesv` copy from the owner's sales deck
  (`Envio-masivo-Clientes/campaña-preoperativo/Preoperativo-vial-_histech.pdf`): supervisor
  approval, auditable PDF and history, indicators, roles, private-security use case,
  implementation steps, five new FAQs. Requested by the owner on 2026-10-07.
  Route: inline (one file, copy within the existing `ServiceContent` shape).
- [x] T5 Product screenshots on `/seguridad-vial-pesv`: eight captures from the same deck in
  `public/servicios/control-vial/`, client logo in the app header replaced by the HisTech logo,
  optional `screenshots` field and an "Así funciona" section in the service template, dashboard
  as hero image. Requested by the owner on 2026-10-07.
  Route: inline (one template section; type and data edits are mechanical).

## Acceptance criteria

- No "Escort" / "ESS" string or asset remains in `frontend/`.
- Rendered `<title>` carries the brand once.
- The three new routes build, appear in the sitemap and `llms.txt`, and emit Service, WebPage,
  BreadcrumbList and FAQPage JSON-LD.
- typecheck, lint and build pass.

## Delivery

Strategy: `ask-on-risk`. Forecast: about 500-600 authored lines, mostly page copy in T3.

## Progress and evidence

- T1 `6a73eea`: logo entry and `public/clientes/ESCORT.png` removed. typecheck passed.
- T2 `ed08095`: `buildMetadata` returns `title.absolute`; `metaTitle` / `metaDescription` on all
  service entries; robots disallows `/portal/` and names nine AI crawlers; `llms.txt` refreshed.
- T3 `d581079`: `/teltonika-colombia`, `/outsourcing-ti`, `/seguridad-vial-pesv` added to
  `servicesContent`, `services[]`, `llms.txt`; optional `brand` on `ServiceContent`.
- Parent re-run on 2026-10-07: typecheck passed, build compiled, built `<title>` of the three
  new pages and `/managed-services` carries `| HISTECH` once; no "escort" / "autorizado" in copy.
- T4: `services-content.ts` only. Capabilities 5 -> 9, use cases 4 -> 6, benefits 6 -> 8,
  FAQs 6 -> 11, product name "HISTECH Control Vial" in the intro. typecheck passed; dev server
  returns 200 for the page with the new copy and no "escort" / "ESS" string. Production build
  not re-run for T4.
- T5: typecheck passed; page and the eight WebP files return 200 on the dev server; headless
  Edge capture at 1400 px shows the hero image and the section rendering (5 phone + 3 wide).
  Mobile width not captured. Production build not re-run. Four phone captures had the client
  logo replaced; the deck's page-4 infographic is fully client-branded and was not used.
- `npm run lint`: NOT run. `next lint` has no ESLint config and stops at an interactive prompt.
- Build logs `ECONNREFUSED` fetches (backend not running locally); build still succeeds.
- Review tier: unassessed (`gentle-ai` unavailable). No native review run.
- Not pushed, no PR, not deployed.

## Open items for the owner

- ESLint: add a config or drop the lint check.
- PESV screenshots still show the Next.js dev badge and demo data; retake clean captures later.
- `automatizacion-empresarial` and `desarrollo-software-colombia` are still missing from `services[]`.
- Is HisTech an authorized Teltonika distributor (changes wording)?
- Real LinkedIn / Facebook / X URLs for `sameAs`; the current X URL looks like a placeholder.
- Google Search Console / Bing verification codes.
