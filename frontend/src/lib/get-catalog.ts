import { createCatalogClient } from "@/lib/catalog/client";

/**
 * Server-side catalog loaders (ISR, revalidate 60s), same pattern as
 * `get-products.ts`: BACKEND_URL missing or backend down never throws; the
 * pages render an empty/unavailable state instead.
 */
const catalog = createCatalogClient({ baseUrl: process.env.BACKEND_URL });

export const getCatalogProducts = catalog.listProducts;
export const getCatalogProduct = catalog.getProduct;
export const getCatalogCategories = catalog.listCategories;
export const getCatalogBrands = catalog.listBrands;
export const getAllCatalogProducts = catalog.listAllPublishedProducts;

export type { ProductListResult, PublicProduct, PublicProductDetail, PublicCategory, PublicBrand } from "@/lib/catalog/types";
