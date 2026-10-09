import Link from "next/link";
import { Search } from "lucide-react";
import { buildListingHref } from "@/lib/catalog/listing-query";
import type { PublicBrand, PublicCategory } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const chipIdle = "border-[#E5E7EB] bg-white text-foreground/80 hover:border-brand-purple/50 hover:text-foreground";
const chipActive = "border-brand-purple bg-brand-purple/10 font-medium text-brand-purple";

/**
 * Server-rendered filters. Everything is a plain link or a GET form, so the
 * filters work without JavaScript and are fully keyboard-usable.
 * Categories are clean paths (`/tienda/<slug>`); brand and search are URL params.
 */
export function CatalogFilters({
  basePath,
  categories,
  brands,
  activeCategory,
  activeBrand,
  q,
}: {
  basePath: string;
  categories: PublicCategory[];
  brands: PublicBrand[];
  activeCategory?: string;
  activeBrand?: string;
  q?: string;
}) {
  const visibleCategories = categories.filter((c) => c.productCount > 0);
  const visibleBrands = brands.filter((b) => b.productCount > 0);
  const hasFilters = Boolean(q || activeBrand);

  return (
    <div className="space-y-8">
      <form action={basePath} method="get" role="search" className="space-y-3">
        <label htmlFor="catalog-search" className="block text-sm font-semibold">
          Buscar productos
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="catalog-search"
            name="q"
            type="search"
            defaultValue={q ?? ""}
            maxLength={100}
            placeholder="Nombre, modelo o referencia"
            className="h-11 w-full rounded-xl border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
          />
        </div>
        {activeBrand ? <input type="hidden" name="marca" value={activeBrand} /> : null}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-gradient px-5 text-sm font-medium text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Buscar
          </button>
          {hasFilters ? (
            <Link href={basePath} className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
              Limpiar filtros
            </Link>
          ) : null}
        </div>
      </form>

      {visibleCategories.length > 0 ? (
        <nav aria-labelledby="filter-categories">
          <h2 id="filter-categories" className="text-sm font-semibold">
            Categorías
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li>
              <Link
                href={buildListingHref("/tienda", { q, brand: activeBrand })}
                aria-current={!activeCategory ? "page" : undefined}
                className={cn(chip, !activeCategory ? chipActive : chipIdle)}
              >
                Todas
              </Link>
            </li>
            {visibleCategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={buildListingHref(`/tienda/${c.slug}`, { q, brand: activeBrand })}
                  aria-current={activeCategory === c.slug ? "page" : undefined}
                  className={cn(chip, activeCategory === c.slug ? chipActive : chipIdle)}
                >
                  {c.name}
                  <span className="text-xs text-muted-foreground">({c.productCount})</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {visibleBrands.length > 0 ? (
        <nav aria-labelledby="filter-brands">
          <h2 id="filter-brands" className="text-sm font-semibold">
            Marcas
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li>
              <Link
                href={buildListingHref(basePath, { q })}
                aria-current={!activeBrand ? "page" : undefined}
                className={cn(chip, !activeBrand ? chipActive : chipIdle)}
              >
                Todas
              </Link>
            </li>
            {visibleBrands.map((b) => (
              <li key={b.id}>
                <Link
                  href={buildListingHref(basePath, { q, brand: b.slug })}
                  aria-current={activeBrand === b.slug ? "page" : undefined}
                  className={cn(chip, activeBrand === b.slug ? chipActive : chipIdle)}
                >
                  {b.name}
                  <span className="text-xs text-muted-foreground">({b.productCount})</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
