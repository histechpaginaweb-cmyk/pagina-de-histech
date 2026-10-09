import { toApiQuery, LISTING_PAGE_SIZE } from "./listing-query";
import type {
  ListResult,
  ProductListResult,
  ProductLookup,
  PublicBrand,
  PublicCategory,
  PublicProduct,
  PublicProductDetail,
} from "./types";

const REVALIDATE_SECONDS = 60;
const SITEMAP_PAGE_SIZE = 48; // backend maximum
const MAX_SITEMAP_PAGES = 100;

export type CatalogClientOptions = {
  /** Backend origin (`BACKEND_URL`). Missing means "catalog unavailable", never an error. */
  baseUrl: string | undefined;
  fetchImpl?: typeof fetch;
  warn?: (message: string, err?: unknown) => void;
  sitemapPageSize?: number;
};

class Unavailable extends Error {}

/**
 * Read-only client for the public catalog API. Every method degrades to an
 * empty/unavailable result instead of throwing, so a backend outage can never
 * break a build or a render (same philosophy as `get-products.ts`).
 */
export function createCatalogClient({
  baseUrl,
  fetchImpl = (input, init) => fetch(input, init),
  warn = (message, err) => console.warn(message, err),
  sitemapPageSize = SITEMAP_PAGE_SIZE,
}: CatalogClientOptions) {
  const origin = baseUrl?.replace(/\/+$/, "");

  /** Fetches JSON. Returns `{status, body}`; throws `Unavailable` on transport failure. */
  async function request(path: string): Promise<{ status: number; body: unknown }> {
    if (!origin) throw new Unavailable("BACKEND_URL no definido");
    try {
      const res = await fetchImpl(`${origin}/api/catalog${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        // Non-JSON body: only meaningful for error statuses.
      }
      return { status: res.status, body };
    } catch (err) {
      throw new Unavailable(err instanceof Error ? err.message : String(err));
    }
  }

  const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

  async function listProducts(params: {
    category?: string;
    brand?: string;
    q?: string;
    page: number;
    pageSize?: number;
  }): Promise<ProductListResult> {
    const pageSize = params.pageSize ?? LISTING_PAGE_SIZE;
    const empty: ProductListResult = { items: [], total: 0, page: params.page, pageSize, unavailable: true };
    try {
      const { status, body } = await request(`/products?${toApiQuery({ ...params, pageSize })}`);
      if (status < 200 || status >= 300 || !isObject(body) || !Array.isArray(body.items)) {
        throw new Unavailable(`HTTP ${status}`);
      }
      return {
        items: body.items as PublicProduct[],
        total: Number(body.total) || 0,
        page: Number(body.page) || params.page,
        pageSize: Number(body.pageSize) || pageSize,
        unavailable: false,
      };
    } catch (err) {
      warn("[catalog] productos no disponibles:", err);
      return empty;
    }
  }

  async function listArray<T>(path: string): Promise<ListResult<T>> {
    try {
      const { status, body } = await request(path);
      if (status < 200 || status >= 300 || !Array.isArray(body)) throw new Unavailable(`HTTP ${status}`);
      return { items: body as T[], unavailable: false };
    } catch (err) {
      warn(`[catalog] ${path} no disponible:`, err);
      return { items: [], unavailable: true };
    }
  }

  async function getProduct(slug: string): Promise<ProductLookup> {
    try {
      const { status, body } = await request(`/products/${encodeURIComponent(slug)}`);
      if (status === 404) return { status: "not_found" };
      if (status < 200 || status >= 300 || !isObject(body) || typeof body.slug !== "string") {
        throw new Unavailable(`HTTP ${status}`);
      }
      const related = Array.isArray(body.related) ? (body.related as PublicProduct[]) : [];
      return { status: "ok", product: { ...(body as unknown as PublicProductDetail), related } };
    } catch (err) {
      warn("[catalog] producto no disponible:", err);
      return { status: "unavailable" };
    }
  }

  /** Every published product, for the sitemap. Returns what it could collect on failure. */
  async function listAllPublishedProducts(): Promise<PublicProduct[]> {
    const all: PublicProduct[] = [];
    for (let page = 1; page <= MAX_SITEMAP_PAGES; page += 1) {
      const result = await listProducts({ page, pageSize: sitemapPageSize });
      if (result.unavailable) break;
      all.push(...result.items);
      if (result.items.length === 0 || all.length >= result.total) break;
    }
    return all;
  }

  return {
    listProducts,
    getProduct,
    listCategories: () => listArray<PublicCategory>("/categories"),
    listBrands: () => listArray<PublicBrand>("/brands"),
    listAllPublishedProducts,
  };
}

export type CatalogClient = ReturnType<typeof createCatalogClient>;
