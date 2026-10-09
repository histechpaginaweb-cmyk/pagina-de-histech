/** URL <-> filter state for the catalog listings (pure, no Next imports). */

export const LISTING_PAGE_SIZE = 12;
const MAX_QUERY_LENGTH = 100;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ListingParams = {
  q?: string;
  /** Brand slug (`?marca=`). */
  brand?: string;
  page: number;
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Never throws: invalid values fall back to defaults. */
export function parseListingParams(raw: RawSearchParams): ListingParams {
  const q = first(raw.q)?.trim().slice(0, MAX_QUERY_LENGTH) || undefined;
  const brandRaw = first(raw.marca)?.trim();
  const brand = brandRaw && SLUG.test(brandRaw) ? brandRaw : undefined;
  const pageRaw = first(raw.pagina)?.trim() ?? "";
  const page = /^\d+$/.test(pageRaw) && Number(pageRaw) >= 1 ? Number(pageRaw) : 1;
  return { q, brand, page };
}

/** Link to a listing state. The clean path is returned when no filter is active. */
export function buildListingHref(
  basePath: string,
  { q, brand, page }: { q?: string; brand?: string; page?: number },
): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (brand) params.set("marca", brand);
  if (page && page > 1) params.set("pagina", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Query string for `GET /api/catalog/products`. */
export function toApiQuery({
  category,
  brand,
  q,
  page,
  pageSize = LISTING_PAGE_SIZE,
}: {
  category?: string;
  brand?: string;
  q?: string;
  page: number;
  pageSize?: number;
}): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (q) params.set("q", q);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return params.toString();
}

/** True when the URL is a filtered/searched/paginated variant of the clean listing. */
export function hasListingVariant({ q, brand, page }: ListingParams): boolean {
  return Boolean(q || brand || page > 1);
}

/** Page numbers to render in the pager, with `null` standing for an ellipsis. */
export function pageWindow(current: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}
