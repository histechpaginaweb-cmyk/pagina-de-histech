import { notFound } from "next/navigation";
import { CatalogListing } from "@/components/templates/catalog-listing";
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from "@/lib/get-catalog";
import { parseListingParams, type RawSearchParams } from "@/lib/catalog/listing-query";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const { categoria } = await params;
  const categories = await getCatalogCategories();
  const category = categories.items.find((c) => c.slug === categoria);
  if (!category) return {};
  return buildMetadata({
    title: category.seoTitle ?? `${category.name} | Tienda`,
    description: category.seoDescription ?? category.description ?? undefined,
    path: `/tienda/${category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  const listing = parseListingParams(await searchParams);

  const [categories, brands] = await Promise.all([getCatalogCategories(), getCatalogBrands()]);
  const category = categories.items.find((c) => c.slug === categoria);

  // Unknown or empty categories are not browsable. During an outage we cannot
  // tell, so render the friendly unavailable state instead of a misleading 404.
  if (!categories.unavailable && (!category || category.productCount === 0)) notFound();

  const result = await getCatalogProducts({
    category: categoria,
    brand: listing.brand,
    q: listing.q,
    page: listing.page,
  });
  if (!result.unavailable && listing.page > 1 && result.items.length === 0) notFound();

  const name = category?.name ?? "Categoría";
  const basePath = `/tienda/${categoria}`;

  return (
    <CatalogListing
      basePath={basePath}
      title={name}
      description={
        category?.description ??
        `Productos de la categoría ${name} con acompañamiento de un asesor HISTECH.`
      }
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: "Tienda", path: "/tienda" },
        { name, path: basePath },
      ]}
      params={listing}
      result={result}
      categories={categories.items}
      brands={brands.items}
      activeCategory={categoria}
    />
  );
}
