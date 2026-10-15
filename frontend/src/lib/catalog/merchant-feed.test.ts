import { describe, expect, it } from "vitest";
import { buildMerchantFeed, escapeXml, isFeedEligible } from "./merchant-feed";
import type { PublicProduct } from "./types";

const SITE = "https://histech.com.co";

function product(overrides: Record<string, unknown> = {}): PublicProduct {
  return {
    id: "p1",
    slug: "rg-s1-ruijie",
    name: "RG-S1 Ruijie",
    brand: { id: "b1", slug: "ruijie", name: "Ruijie", logoUrl: null },
    category: { id: "c1", slug: "switches-poe", name: "Switches PoE" },
    model: "RG-S1",
    sku: "RG-S1-SKU",
    shortDescription: "Switch PoE 24 puertos Gigabit",
    description: null,
    datasheetUrl: null,
    specs: [],
    images: [
      { url: "/tienda/a.webp", alt: "" },
      { url: "https://cdn.test/b.jpg", alt: "" },
      { url: "https://cdn.test/c.jpg", alt: "" },
    ],
    availability: "in_stock",
    featured: false,
    seoTitle: null,
    seoDescription: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    consultPrice: false,
    price: 114242,
    priceCurrency: "COP",
    priceUpdatedAt: null,
    ...overrides,
  } as PublicProduct;
}

describe("escapeXml", () => {
  it("escapes the five XML entities and strips control characters", () => {
    expect(escapeXml(`a & b < c > "d" 'e'\u0000\u0008`)).toBe("a &amp; b &lt; c &gt; &quot;d&quot; &apos;e&apos;");
  });
});

describe("isFeedEligible", () => {
  it("requires a visible price and an image", () => {
    expect(isFeedEligible(product())).toBe(true);
    expect(isFeedEligible(product({ consultPrice: true, price: undefined, priceCurrency: undefined }))).toBe(false);
    expect(isFeedEligible(product({ price: 0 }))).toBe(false);
    expect(isFeedEligible(product({ images: [] }))).toBe(false);
  });
});

describe("buildMerchantFeed", () => {
  it("builds an RSS 2.0 channel with the Google namespace", () => {
    const xml = buildMerchantFeed([product()], { siteUrl: SITE });
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">');
    expect(xml).toContain("<channel>");
    expect(xml).toContain(`<link>${SITE}/tienda</link>`);
  });

  it("emits every Merchant field for an eligible product", () => {
    const xml = buildMerchantFeed([product()], { siteUrl: SITE });
    expect(xml).toContain("<g:id>RG-S1-SKU</g:id>");
    expect(xml).toContain("<title>RG-S1 Ruijie</title>");
    expect(xml).toContain("<description>Switch PoE 24 puertos Gigabit</description>");
    expect(xml).toContain(`<link>${SITE}/tienda/producto/rg-s1-ruijie</link>`);
    expect(xml).toContain(`<g:image_link>${SITE}/tienda/a.webp</g:image_link>`);
    expect(xml).toContain("<g:additional_image_link>https://cdn.test/b.jpg</g:additional_image_link>");
    expect(xml).toContain("<g:additional_image_link>https://cdn.test/c.jpg</g:additional_image_link>");
    expect(xml).toContain("<g:price>114242.00 COP</g:price>");
    expect(xml).toContain("<g:availability>in_stock</g:availability>");
    expect(xml).toContain("<g:condition>new</g:condition>");
    expect(xml).toContain("<g:brand>Ruijie</g:brand>");
    expect(xml).toContain("<g:mpn>RG-S1</g:mpn>");
    expect(xml).toContain("<g:product_type>Switches PoE</g:product_type>");
    expect(xml).toContain("<g:identifier_exists>yes</g:identifier_exists>");
  });

  it("maps availability", () => {
    expect(buildMerchantFeed([product({ availability: "on_request" })], { siteUrl: SITE })).toContain(
      "<g:availability>backorder</g:availability>",
    );
    expect(buildMerchantFeed([product({ availability: "out_of_stock" })], { siteUrl: SITE })).toContain(
      "<g:availability>out_of_stock</g:availability>",
    );
  });

  it("excludes products without a public price and keeps one item per eligible product", () => {
    const xml = buildMerchantFeed(
      [
        product(),
        product({ slug: "hidden", consultPrice: true, price: undefined, priceCurrency: undefined }),
        product({ slug: "second", sku: "S2" }),
      ],
      { siteUrl: SITE },
    );
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).not.toContain("hidden");
  });

  it("escapes product text", () => {
    const xml = buildMerchantFeed([product({ name: 'A & B <C> "D"', brand: null, model: null })], { siteUrl: SITE });
    expect(xml).toContain("<title>A &amp; B &lt;C&gt; &quot;D&quot;</title>");
    expect(xml).toContain("<g:identifier_exists>no</g:identifier_exists>");
    expect(xml).not.toContain("<g:brand>");
    expect(xml).not.toContain("<g:mpn>");
  });

  it("falls back to model, then slug, for the id", () => {
    expect(buildMerchantFeed([product({ sku: null })], { siteUrl: SITE })).toContain("<g:id>RG-S1</g:id>");
    expect(buildMerchantFeed([product({ sku: null, model: null })], { siteUrl: SITE })).toContain(
      "<g:id>rg-s1-ruijie</g:id>",
    );
  });

  it("formats USD prices with the product currency", () => {
    expect(buildMerchantFeed([product({ price: 99.5, priceCurrency: "USD" })], { siteUrl: SITE })).toContain(
      "<g:price>99.50 USD</g:price>",
    );
  });

  it("produces a valid empty channel with no products", () => {
    const xml = buildMerchantFeed([], { siteUrl: SITE });
    expect(xml).not.toContain("<item>");
    expect(xml).toContain("</channel></rss>");
  });
});
