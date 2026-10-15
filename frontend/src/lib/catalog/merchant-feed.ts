import { hasVisiblePrice } from "./price";
import type { Availability, PublicProduct } from "./types";

const MAX_ADDITIONAL_IMAGES = 10;
const MAX_DESCRIPTION = 5000;

const AVAILABILITY: Record<Availability, string> = {
  in_stock: "in_stock",
  on_request: "backorder",
  out_of_stock: "out_of_stock",
};

// eslint-disable-next-line no-control-regex
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

/** Escapes text for XML element content and drops characters XML 1.0 cannot carry. */
export function escapeXml(value: string): string {
  return value
    .replace(INVALID_XML_CHARS, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Feed rule: published (the public API only returns those), with a public price
 * (`consultPrice` or hidden prices drop the product) and at least one image, which
 * Merchant Center requires.
 */
export function isFeedEligible(product: PublicProduct): boolean {
  return hasVisiblePrice(product) && product.images.length > 0;
}

const absolute = (siteUrl: string, path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

const tag = (name: string, value: string | undefined) => (value ? `<${name}>${escapeXml(value)}</${name}>` : "");

function buildItem(product: PublicProduct & { price: number; priceCurrency: string }, siteUrl: string): string {
  const mpn = product.model?.trim() || undefined;
  const brand = product.brand?.name.trim() || undefined;
  const id = product.sku?.trim() || mpn || product.slug;
  const description = (product.shortDescription?.trim() || product.name).slice(0, MAX_DESCRIPTION);
  const [main, ...rest] = product.images.map((image) => absolute(siteUrl, image.url));

  return [
    "<item>",
    tag("g:id", id),
    tag("title", product.name),
    tag("description", description),
    tag("link", absolute(siteUrl, `/tienda/producto/${product.slug}`)),
    tag("g:image_link", main),
    ...rest.slice(0, MAX_ADDITIONAL_IMAGES).map((url) => tag("g:additional_image_link", url)),
    tag("g:price", `${product.price.toFixed(2)} ${product.priceCurrency}`),
    tag("g:availability", AVAILABILITY[product.availability] ?? AVAILABILITY.on_request),
    tag("g:condition", "new"),
    tag("g:brand", brand),
    tag("g:mpn", mpn),
    tag("g:product_type", product.category?.name),
    tag("g:identifier_exists", brand && mpn ? "yes" : "no"),
    "</item>",
  ].join("");
}

/** Google Shopping RSS 2.0 feed. Prices come from the catalog already IVA-included. */
export function buildMerchantFeed(products: PublicProduct[], { siteUrl }: { siteUrl: string }): string {
  const items = products.filter(isFeedEligible).map((p) => buildItem(p as Parameters<typeof buildItem>[0], siteUrl));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "<channel>",
    "<title>Tienda HISTECH</title>",
    `<link>${escapeXml(absolute(siteUrl, "/tienda"))}</link>`,
    "<description>Equipos de red Ruijie y Reyee con precios con IVA incluido.</description>",
    ...items,
    "</channel></rss>",
  ].join("");
}
