import { describe, expect, it } from "vitest";
import {
  availabilityToSchema,
  buildCatalogSitemapEntries,
  categoryMetadataInput,
  itemListJsonLd,
  listingMetadataInput,
  productJsonLd,
  productMetadataInput,
} from "./seo";
import type { PublicCategory, PublicProduct } from "./types";

const SITE = "https://histech.com.co";

function product(overrides: Record<string, unknown> = {}): PublicProduct {
  return {
    id: "p1",
    slug: "teltonika-rut956",
    name: "Teltonika RUT956",
    brand: { id: "b1", slug: "teltonika", name: "Teltonika", logoUrl: null },
    category: { id: "c1", slug: "routers", name: "Routers" },
    model: "RUT956",
    sku: "RUT956-SKU",
    shortDescription: "Router celular industrial 4G.",
    description: "## Detalle",
    datasheetUrl: null,
    specs: [],
    images: [
      { url: "/tienda/rut956.webp", alt: "RUT956" },
      { url: "https://cdn.test/b.jpg", alt: "" },
    ],
    availability: "in_stock",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    consultPrice: true,
    ...overrides,
  } as PublicProduct;
}

const withPrice = (overrides: Record<string, unknown> = {}) =>
  product({ consultPrice: false, priceCop: 850000, priceUpdatedAt: "2026-02-01T00:00:00.000Z", ...overrides });

describe("availabilityToSchema", () => {
  it("maps the three availabilities to schema.org values", () => {
    expect(availabilityToSchema("in_stock")).toBe("https://schema.org/InStock");
    expect(availabilityToSchema("on_request")).toBe("https://schema.org/BackOrder");
    expect(availabilityToSchema("out_of_stock")).toBe("https://schema.org/OutOfStock");
  });
});

describe("productJsonLd", () => {
  it("describes the product with absolute urls, mpn and brand", () => {
    const ld = productJsonLd(product(), { siteUrl: SITE });
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Product");
    expect(ld.name).toBe("Teltonika RUT956");
    expect(ld.sku).toBe("RUT956-SKU");
    expect(ld.mpn).toBe("RUT956");
    expect(ld.brand).toEqual({ "@type": "Brand", name: "Teltonika" });
    expect(ld.category).toBe("Routers");
    expect(ld.url).toBe(`${SITE}/tienda/producto/teltonika-rut956`);
    expect(ld.image).toEqual([`${SITE}/tienda/rut956.webp`, "https://cdn.test/b.jpg"]);
    expect(ld.description).toBe("Router celular industrial 4G.");
  });

  it("emits NO offer and no price data when the price is hidden", () => {
    const ld = productJsonLd(product({ consultPrice: true }), { siteUrl: SITE });
    expect("offers" in ld).toBe(false);
    const json = JSON.stringify(ld);
    expect(json).not.toMatch(/price/i);
    expect(json).not.toContain("COP");
    expect(json).not.toContain("InStock");
  });

  it("emits an Offer with VAT-excluded price specification when the price is visible", () => {
    const ld = productJsonLd(withPrice(), { siteUrl: SITE });
    expect(ld.offers).toEqual({
      "@type": "Offer",
      url: `${SITE}/tienda/producto/teltonika-rut956`,
      priceCurrency: "COP",
      price: 850000,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE}/#organization` },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: 850000,
        priceCurrency: "COP",
        valueAddedTaxIncluded: false,
      },
    });
  });

  it("maps on_request and out_of_stock availability inside the offer", () => {
    expect(productJsonLd(withPrice({ availability: "on_request" }), { siteUrl: SITE }).offers?.availability).toBe(
      "https://schema.org/BackOrder",
    );
    expect(productJsonLd(withPrice({ availability: "out_of_stock" }), { siteUrl: SITE }).offers?.availability).toBe(
      "https://schema.org/OutOfStock",
    );
  });

  it("omits empty optional fields instead of emitting nulls", () => {
    const ld = productJsonLd(
      product({ sku: null, model: null, brand: null, category: null, images: [], shortDescription: null }),
      { siteUrl: SITE },
    );
    for (const key of ["sku", "mpn", "brand", "category", "image"]) expect(key in ld).toBe(false);
    expect(typeof ld.description).toBe("string");
  });
});

describe("itemListJsonLd", () => {
  it("lists products by position without any price data", () => {
    const ld = itemListJsonLd([withPrice(), product({ slug: "b", name: "B" })], { siteUrl: SITE, name: "Tienda" });
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      url: `${SITE}/tienda/producto/teltonika-rut956`,
      name: "Teltonika RUT956",
    });
    expect(JSON.stringify(ld)).not.toMatch(/price|COP/i);
  });
});

describe("productMetadataInput", () => {
  it("prefers the authored SEO fields and uses the first image for Open Graph", () => {
    const input = productMetadataInput(product({ seoTitle: "Custom title", seoDescription: "Custom description" }));
    expect(input).toEqual({
      title: "Custom title",
      description: "Custom description",
      path: "/tienda/producto/teltonika-rut956",
      image: "/tienda/rut956.webp",
    });
  });

  it("falls back to name and short description", () => {
    const input = productMetadataInput(product());
    expect(input.title).toBe("Teltonika RUT956");
    expect(input.description).toBe("Router celular industrial 4G.");
  });

  it("builds a price-free fallback description when nothing is authored", () => {
    const input = productMetadataInput(withPrice({ shortDescription: null, images: [] }));
    expect(input.description).toContain("Teltonika RUT956");
    expect(input.description).not.toMatch(/\$|IVA|COP/);
    expect(input.image).toBeUndefined();
  });

  it("truncates long fallback descriptions", () => {
    const input = productMetadataInput(product({ shortDescription: "palabra ".repeat(80) }));
    expect(input.description.length).toBeLessThanOrEqual(160);
  });
});

describe("listing metadata", () => {
  it("uses the clean path as canonical for filter and page variants", () => {
    const input = listingMetadataInput({
      basePath: "/tienda",
      title: "Tienda",
      description: "d",
      params: { page: 3, brand: "teltonika" },
    });
    expect(input.path).toBe("/tienda");
    expect(input.noindex).toBe(false);
  });

  it("marks free-text searches as noindex", () => {
    expect(
      listingMetadataInput({ basePath: "/tienda", title: "Tienda", description: "d", params: { page: 1, q: "rut" } })
        .noindex,
    ).toBe(true);
  });

  it("builds category metadata with fallbacks", () => {
    const category = {
      id: "c",
      slug: "routers",
      name: "Routers",
      description: "Routers industriales",
      seoTitle: null,
      seoDescription: null,
      sortOrder: 0,
      productCount: 2,
    } satisfies PublicCategory;
    const input = categoryMetadataInput(category, { page: 1 });
    expect(input.title).toBe("Routers — Tienda");
    expect(input.description).toBe("Routers industriales");
    expect(input.path).toBe("/tienda/routers");
    expect(categoryMetadataInput({ ...category, seoTitle: "SEO", seoDescription: "SEO d" }, { page: 1 })).toMatchObject({
      title: "SEO",
      description: "SEO d",
    });
  });
});

describe("buildCatalogSitemapEntries", () => {
  const categories: PublicCategory[] = [
    { id: "1", slug: "routers", name: "Routers", description: null, seoTitle: null, seoDescription: null, sortOrder: 0, productCount: 2 },
    { id: "2", slug: "vacia", name: "Vacía", description: null, seoTitle: null, seoDescription: null, sortOrder: 1, productCount: 0 },
  ];

  it("lists the store, non-empty categories and products with lastModified from updatedAt", () => {
    const entries = buildCatalogSitemapEntries({
      products: [
        product({ updatedAt: "2026-03-01T00:00:00.000Z" }),
        product({ slug: "otro", updatedAt: "2026-04-01T00:00:00.000Z" }),
      ],
      categories,
      siteUrl: SITE,
    });
    expect(entries.map((e) => e.url)).toEqual([
      `${SITE}/tienda`,
      `${SITE}/tienda/routers`,
      `${SITE}/tienda/producto/teltonika-rut956`,
      `${SITE}/tienda/producto/otro`,
    ]);
    expect(entries[0].lastModified).toEqual(new Date("2026-04-01T00:00:00.000Z"));
    expect(entries[2].lastModified).toEqual(new Date("2026-03-01T00:00:00.000Z"));
  });

  it("still lists /tienda when the backend returned nothing", () => {
    const entries = buildCatalogSitemapEntries({ products: [], categories: [], siteUrl: SITE });
    expect(entries.map((e) => e.url)).toEqual([`${SITE}/tienda`]);
    expect(entries[0].lastModified).toBeUndefined();
  });
});
