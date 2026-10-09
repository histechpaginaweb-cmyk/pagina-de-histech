import { getPriceDisplay } from "@/lib/catalog/price";
import type { PublicProduct } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Price presentation shared by cards and product pages. All decisions live in
 * `getPriceDisplay`; this component only renders its result.
 */
export function PriceBlock({
  product,
  size = "detail",
  className,
}: {
  product: PublicProduct;
  size?: "card" | "detail";
  className?: string;
}) {
  const display = getPriceDisplay(product);
  const detail = size === "detail";

  if (display.kind === "consult") {
    return (
      <p className={cn("font-display font-semibold text-foreground", detail ? "text-2xl" : "text-base", className)}>
        {display.label}
      </p>
    );
  }

  return (
    <div className={className}>
      <p
        className={cn(
          "font-display font-bold text-foreground",
          detail ? "text-3xl sm:text-4xl" : "text-xl",
        )}
      >
        {display.formatted}
        <span className="ml-2 align-middle text-sm font-medium text-muted-foreground">{display.taxLabel}</span>
      </p>
      {detail && display.note ? (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{display.note}</p>
      ) : null}
    </div>
  );
}
