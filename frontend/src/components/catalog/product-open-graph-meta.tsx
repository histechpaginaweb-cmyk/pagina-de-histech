import { productOpenGraphMeta } from "@/lib/catalog/product-seo";
import type { PublicProduct } from "@/lib/catalog/types";

/**
 * Open Graph `og:type` and price tags. Rendered as `<meta property>` (React 19 hoists
 * them into <head>) because Next's `other` metadata can only emit `name=`.
 */
export function ProductOpenGraphMeta({ product }: { product: PublicProduct }) {
  return (
    <>
      {productOpenGraphMeta(product).map(({ property, content }) => (
        <meta key={property} property={property} content={content} />
      ))}
    </>
  );
}
