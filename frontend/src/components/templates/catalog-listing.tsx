import Link from "next/link";
import { PackageSearch, ServerCrash } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/catalog/product-card";
import { hasListingVariant, type ListingParams } from "@/lib/catalog/listing-query";
import type { ProductListResult, PublicBrand, PublicCategory } from "@/lib/catalog/types";

type Props = {
  /** `/tienda` or `/tienda/<categoria>`. */
  basePath: string;
  title: string;
  description: string;
  breadcrumbs: { name: string; path: string }[];
  params: ListingParams;
  result: ProductListResult;
  categories: PublicCategory[];
  brands: PublicBrand[];
  activeCategory?: string;
  /** Extra content rendered under the hero copy (advisor CTA). */
  heroActions?: React.ReactNode;
  /** Extra content rendered after the product grid (advisor CTA). */
  footer?: React.ReactNode;
};

export function CatalogListing({
  basePath,
  title,
  description,
  breadcrumbs,
  params,
  result,
  categories,
  brands,
  activeCategory,
  heroActions,
  footer,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const filtered = hasListingVariant(params);

  return (
    <>
      <section className="relative isolate overflow-hidden pb-10 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Tienda</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">{title}</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{description}</p>
            {heroActions ? <div className="mt-8">{heroActions}</div> : null}
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
            <aside aria-label="Filtros del catálogo">
              <CatalogFilters
                basePath={basePath}
                categories={categories}
                brands={brands}
                activeCategory={activeCategory}
                activeBrand={params.brand}
                q={params.q}
              />
            </aside>

            <div>
              <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
                {result.unavailable
                  ? ""
                  : result.total === 1
                    ? "1 producto"
                    : `${result.total} productos`}
                {!result.unavailable && totalPages > 1 ? ` · Página ${params.page} de ${totalPages}` : ""}
              </p>

              {result.items.length > 0 ? (
                <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((product, i) => (
                    <li key={product.id}>
                      <ProductCard product={product} priority={i < 3} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState unavailable={result.unavailable} filtered={filtered} basePath={basePath} />
              )}

              <Pagination basePath={basePath} page={params.page} totalPages={totalPages} q={params.q} brand={params.brand} />
            </div>
          </div>
        </Container>
      </Section>

      {footer}
    </>
  );
}

function EmptyState({
  unavailable,
  filtered,
  basePath,
}: {
  unavailable: boolean;
  filtered: boolean;
  basePath: string;
}) {
  const Icon = unavailable ? ServerCrash : PackageSearch;
  return (
    <div className="card-surface !transform-none flex flex-col items-center gap-4 p-10 text-center">
      <Icon className="size-12 text-brand-purple/60" aria-hidden />
      <h2 className="text-xl font-semibold">
        {unavailable
          ? "El catálogo no está disponible en este momento"
          : filtered
            ? "No encontramos productos con estos filtros"
            : "Estamos preparando el catálogo"}
      </h2>
      <p className="max-w-md text-muted-foreground">
        {unavailable
          ? "Estamos teniendo un inconveniente técnico. Vuelve a intentarlo en unos minutos o habla con un asesor y te ayudamos de inmediato."
          : filtered
            ? "Prueba con otra búsqueda o limpia los filtros para ver todo el catálogo."
            : "Muy pronto publicaremos nuevos productos. Mientras tanto, un asesor puede ayudarte a encontrar el equipo adecuado."}
      </p>
      {filtered && !unavailable ? (
        <Link href={basePath} className="text-sm font-medium text-brand-purple underline-offset-2 hover:underline">
          Limpiar filtros
        </Link>
      ) : null}
    </div>
  );
}
