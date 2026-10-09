/** Public catalog contract, mirroring `backend/catalog` (dates are ISO strings). */

export type Availability = "in_stock" | "on_request" | "out_of_stock";

export type ProductSpec = { label: string; value: string };
export type ProductImage = { url: string; alt: string };

export type ProductBrand = { id: string; slug: string; name: string; logoUrl: string | null };
export type ProductCategoryRef = { id: string; slug: string; name: string };

type ProductBase = {
  id: string;
  slug: string;
  name: string;
  brand: ProductBrand | null;
  category: ProductCategoryRef | null;
  model: string | null;
  sku: string | null;
  shortDescription: string | null;
  /** Markdown authored in the admin. */
  description: string | null;
  datasheetUrl: string | null;
  specs: ProductSpec[];
  images: ProductImage[];
  availability: Availability;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * The backend omits `priceCop` / `priceUpdatedAt` entirely when the price is
 * hidden, so the two variants are mutually exclusive on `consultPrice`.
 */
export type PublicProduct = ProductBase &
  (
    | { consultPrice: true; priceCop?: undefined; priceUpdatedAt?: undefined }
    | { consultPrice: false; priceCop: number; priceUpdatedAt: string | null }
  );

export type PublicProductDetail = PublicProduct & { related: PublicProduct[] };

export type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  productCount: number;
};

export type PublicBrand = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  productCount: number;
};

export type ProductListResult = {
  items: PublicProduct[];
  total: number;
  page: number;
  pageSize: number;
  /** True when the backend could not be reached or answered with garbage. */
  unavailable: boolean;
};

export type ListResult<T> = { items: T[]; unavailable: boolean };

export type ProductLookup =
  | { status: "ok"; product: PublicProductDetail }
  | { status: "not_found" }
  | { status: "unavailable" };
