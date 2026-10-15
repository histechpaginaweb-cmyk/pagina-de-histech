import { notFound } from "next/navigation";
import { CatalogListing } from "@/components/templates/catalog-listing";
import { getCatalogCategories, getCatalogProducts } from "@/lib/get-catalog";
import { brandCollectionJsonLd, brandMetadataInput, brandPagePath, getBrandPage, BRAND_PAGE_SLUGS } from "@/lib/catalog/brands";
import { parseListingParams, type RawSearchParams } from "@/lib/catalog/listing-query";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// ISR: rebuilt at most every 60s, like the rest of the store.
export const revalidate = 60;

type Props = {
  params: Promise<{ marca: string }>;
  searchParams: Promise<RawSearchParams>;
};

export function generateStaticParams() {
  return BRAND_PAGE_SLUGS.map((marca) => ({ marca }));
}

export async function generateMetadata({ params, searchParams }: Props) {
  const page = getBrandPage((await params).marca);
  if (!page) return {};
  return buildMetadata(brandMetadataInput(page, parseListingParams(await searchParams)));
}

export default async function BrandPage({ params, searchParams }: Props) {
  const page = getBrandPage((await params).marca);
  if (!page) notFound();

  const listing = parseListingParams(await searchParams);
  const [categories, result] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts({ brand: page.slug, q: listing.q, page: listing.page }),
  ]);
  if (!result.unavailable && listing.page > 1 && result.items.length === 0) notFound();

  const basePath = brandPagePath(page.slug);
  return (
    <>
      <CatalogListing
        basePath={basePath}
        title={page.heading}
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Tienda", path: "/tienda" },
          { name: page.heading, path: basePath },
        ]}
        // The brand is fixed by the path: no brand filter, and `?marca=` is ignored.
        params={{ q: listing.q, page: listing.page }}
        result={result}
        categories={categories.items}
        brands={[]}
        intro={
          <header className="mb-8 max-w-3xl">
            <h2 className="font-display text-2xl font-bold">{page.heading}</h2>
            {page.intro.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-muted-foreground text-pretty">
                {paragraph}
              </p>
            ))}
          </header>
        }
      />
      <JsonLd data={brandCollectionJsonLd(page, { siteUrl: siteConfig.url })} />
    </>
  );
}
