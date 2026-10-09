import Image from "next/image";
import { Package } from "lucide-react";
import { canOptimizeImage } from "@/lib/catalog/images";
import { cn } from "@/lib/utils";

/** Fills its positioned parent. Shows a neutral placeholder when there is no image. */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground/50" role="img" aria-label={alt}>
        <Package className="size-12" aria-hidden />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canOptimizeImage(src)}
      className={cn("object-contain", className)}
    />
  );
}
