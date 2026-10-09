import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildListingHref, pageWindow } from "@/lib/catalog/listing-query";
import { cn } from "@/lib/utils";

const base =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Pagination({
  basePath,
  page,
  totalPages,
  q,
  brand,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  q?: string;
  brand?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => buildListingHref(basePath, { q, brand, page: p });

  return (
    <nav aria-label="Paginación del catálogo" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className={cn(base, "border-[#E5E7EB] hover:border-brand-purple/50")}>
              <ChevronLeft className="size-4" aria-hidden />
              <span className="sr-only sm:not-sr-only sm:ml-1">Anterior</span>
            </Link>
          ) : null}
        </li>
        {pageWindow(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Página ${p}`}
                className={cn(
                  base,
                  p === page
                    ? "border-brand-purple bg-brand-purple/10 font-semibold text-brand-purple"
                    : "border-[#E5E7EB] hover:border-brand-purple/50",
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link href={href(page + 1)} rel="next" className={cn(base, "border-[#E5E7EB] hover:border-brand-purple/50")}>
              <span className="sr-only sm:not-sr-only sm:mr-1">Siguiente</span>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}
