import { getAllCatalogProducts } from "@/lib/get-catalog";
import { buildMerchantFeed } from "@/lib/catalog/merchant-feed";
import { siteConfig } from "@/lib/site";

// ISR: regenerated at most every 60s, like the store pages.
export const revalidate = 60;

/**
 * Google Merchant Center feed. Products with hidden or consult prices are left out:
 * the public API already strips prices when the global show-prices setting is off.
 */
export async function GET() {
  const products = await getAllCatalogProducts();
  return new Response(buildMerchantFeed(products, { siteUrl: siteConfig.url }), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
