import type { ProductImage } from "./types";

/**
 * `next/image` only accepts site-relative paths and https hosts allowed by
 * `images.remotePatterns`; anything else throws at render time. The admin
 * accepts plain http URLs, so those are served through `unoptimized`.
 */
export function canOptimizeImage(url: string): boolean {
  if (url.startsWith("/")) return !url.startsWith("//");
  return url.startsWith("https://");
}

export function productImageAlt(image: ProductImage, productName: string, index: number): string {
  const authored = image.alt?.trim();
  if (authored) return authored;
  return index === 0 ? productName : `${productName} — imagen ${index + 1}`;
}
