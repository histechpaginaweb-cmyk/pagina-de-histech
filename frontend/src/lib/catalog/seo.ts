import { ORG_ID } from "@/lib/seo";
import { hasListingVariant, type ListingParams } from "./listing-query";
import type { Availability, PublicCategory, PublicProduct } from "./types";
import { hasVisiblePrice } from "./price";

/**
 * schema.org availability. "Disponible bajo pedido" (HISTECH orders it when the
 * customer asks) maps to BackOrder: orderable now, shipped later. PreOrder
 * means "not released yet", which would be inaccurate for existing products.
 */
const AVAILABILITY_SCHEMA: Record<Availability, string> = {
  in_stock: "https://schema.org/InStock",
  on_request: "https://schema.org/BackOrder",
  out_of_stock: "https://schema.org/OutOfStock",
};

export function availabilityToSchema(availability: Availability): string {
  return AVAILABILITY_SCHEMA[availability] ?? AVAILABILITY_SCHEMA.on_request;
}

const productPath = (slug: string) => `/tienda/producto/${slug}`;
const absolute = (siteUrl: string, path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

const META_DESCRIPTION_MAX = 160;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : cut.length).trimEnd()}…`;
}

/** Name + short description, never a price (metadata must not leak hidden prices). */
function fallbackDescription(product: PublicProduct): string {
  const base =
    product.shortDescription?.trim() ||
    `${product.name}${product.brand ? ` de ${product.brand.name}` : ""}: equipo disponible con asesoría de HISTECH. Consulta especificaciones y solicita tu cotización.`;
  return truncate(base, META_DESCRIPTION_MAX);
}

// ── Metadata inputs (fed to buildMetadata) ──────────────────────────────

export type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
};

export function productMetadataInput(product: PublicProduct): MetadataInput {
  return {
    title: product.seoTitle?.trim() || product.name,
    description: product.seoDescription?.trim() || fallbackDescription(product),
    path: productPath(product.slug),
    image: product.images[0]?.url,
  };
}

/**
 * Filtered, searched and paginated URLs all canonicalize to the clean listing
 * path (brand/page variants stay followable). Free-text searches are also
 * `noindex`, since they are unbounded and thin.
 */
export function listingMetadataInput({
  basePath,
  title,
  description,
  params,
}: {
  basePath: string;
  title: string;
  description: string;
  params: ListingParams;
}): MetadataInput {
  return { title, description, path: basePath, noindex: Boolean(params.q) && hasListingVariant(params) };
}

export function categoryMetadataInput(category: PublicCategory, params: ListingParams): MetadataInput {
  return listingMetadataInput({
    basePath: `/tienda/${category.slug}`,
    title: category.seoTitle?.trim() || `${category.name} — Tienda`,
    description:
      category.seoDescription?.trim() ||
      category.description?.trim() ||
      `Productos de la categoría ${category.name} con asesoría de HISTECH.`,
    params,
  });
}

// ── JSON-LD ─────────────────────────────────────────────────────────────

type ProductOffer = {
  "@type": "Offer";
  url: string;
  priceCurrency: "COP";
  price: number;
  availability: string;
  seller: { "@id": string };
  priceSpecification: {
    "@type": "PriceSpecification";
    price: number;
    priceCurrency: "COP";
    valueAddedTaxIncluded: false;
  };
};

type ProductLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  "@id": string;
  name: string;
  description: string;
  url: string;
  sku?: string;
  mpn?: string;
  brand?: { "@type": "Brand"; name: string };
  category?: string;
  image?: string[];
  offers?: ProductOffer;
};

/**
 * Product structured data. The `Offer` (price, availability, VAT flag) is added
 * only when the price is public; with a hidden price nothing price-related is emitted.
 */
export function productJsonLd(product: PublicProduct, { siteUrl }: { siteUrl: string }): ProductLd {
  const url = absolute(siteUrl, productPath(product.slug));
  const sku = product.sku?.trim();
  const mpn = product.model?.trim();

  const ld: ProductLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.shortDescription?.trim() || fallbackDescription(product),
    url,
    ...(sku && { sku }),
    ...(mpn && { mpn }),
    ...(product.brand && { brand: { "@type": "Brand" as const, name: product.brand.name } }),
    ...(product.category && { category: product.category.name }),
    ...(product.images.length > 0 && { image: product.images.map((i) => absolute(siteUrl, i.url)) }),
  };

  if (hasVisiblePrice(product)) {
    ld.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: product.priceCop,
      availability: availabilityToSchema(product.availability),
      seller: { "@id": ORG_ID },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: product.priceCop,
        priceCurrency: "COP",
        valueAddedTaxIncluded: false,
      },
    };
  }
  return ld;
}

/** ItemList for listings. Intentionally carries no price data. */
export function itemListJsonLd(products: PublicProduct[], { siteUrl, name }: { siteUrl: string; name: string }) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "ItemList" as const,
    name,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: absolute(siteUrl, productPath(p.slug)),
      name: p.name,
    })),
  };
}

// ── Sitemap ─────────────────────────────────────────────────────────────

export type CatalogSitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency: "daily" | "weekly";
  priority: number;
};

function latest(dates: (string | undefined)[]): Date | undefined {
  const times = dates.map((d) => (d ? Date.parse(d) : NaN)).filter((t) => Number.isFinite(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

/** /tienda, non-empty categories and published products. Never throws on empty input. */
export function buildCatalogSitemapEntries({
  products,
  categories,
  siteUrl,
}: {
  products: PublicProduct[];
  categories: PublicCategory[];
  siteUrl: string;
}): CatalogSitemapEntry[] {
  const entries: CatalogSitemapEntry[] = [
    {
      url: absolute(siteUrl, "/tienda"),
      lastModified: latest(products.map((p) => p.updatedAt)),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  for (const category of categories.filter((c) => c.productCount > 0)) {
    entries.push({
      url: absolute(siteUrl, `/tienda/${category.slug}`),
      lastModified: latest(products.filter((p) => p.category?.slug === category.slug).map((p) => p.updatedAt)),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  for (const product of products) {
    entries.push({
      url: absolute(siteUrl, productPath(product.slug)),
      lastModified: latest([product.updatedAt]),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  return entries;
}
