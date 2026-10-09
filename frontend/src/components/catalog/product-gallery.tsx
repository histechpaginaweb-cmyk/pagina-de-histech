"use client";

import * as React from "react";
import { ProductImage } from "@/components/catalog/product-image";
import { productImageAlt } from "@/lib/catalog/images";
import type { ProductImage as ProductImageData } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** Main image plus keyboard-usable thumbnails (native buttons, `aria-pressed`). */
export function ProductGallery({ images, name }: { images: ProductImageData[]; name: string }) {
  const [active, setActive] = React.useState(0);
  const current = images[active];

  return (
    <div className="space-y-4">
      <div className="card-surface relative aspect-square overflow-hidden !transform-none bg-white">
        <ProductImage
          src={current?.url}
          alt={current ? productImageAlt(current, name, active) : name}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="p-6"
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex flex-wrap gap-3" aria-label="Imágenes del producto">
          {images.map((image, i) => (
            <li key={`${image.url}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Ver imagen ${i + 1} de ${images.length}`}
                className={cn(
                  "relative size-20 overflow-hidden rounded-xl border bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  i === active ? "border-brand-purple" : "border-[#E5E7EB] hover:border-brand-purple/50",
                )}
              >
                <ProductImage src={image.url} alt={productImageAlt(image, name, i)} sizes="80px" className="p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
