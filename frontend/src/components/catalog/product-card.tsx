import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";
import { PriceBlock } from "@/components/catalog/price-block";
import { ProductImage } from "@/components/catalog/product-image";
import { productImageAlt } from "@/lib/catalog/images";
import type { PublicProduct } from "@/lib/catalog/types";

export function ProductCard({ product, priority = false }: { product: PublicProduct; priority?: boolean }) {
  const href = `/tienda/producto/${product.slug}`;
  const image = product.images[0];

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden">
      <Link
        href={href}
        className="relative block aspect-[4/3] bg-white"
        aria-label={`Ver ${product.name}`}
        tabIndex={-1}
      >
        <ProductImage
          src={image?.url}
          alt={image ? productImageAlt(image, product.name, 0) : product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="p-4 transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {product.brand ? <span className="font-medium uppercase tracking-widest">{product.brand.name}</span> : null}
          {product.model ? <span>· {product.model}</span> : null}
        </div>

        <h3 className="text-lg font-semibold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-brand-purple">
            {product.name}
          </Link>
        </h3>

        {product.shortDescription ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <PriceBlock product={product} size="card" />
          <AvailabilityBadge availability={product.availability} />
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-purple">
          Ver detalles
          <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
