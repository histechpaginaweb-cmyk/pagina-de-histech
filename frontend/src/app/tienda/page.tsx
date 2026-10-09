import { notFound } from "next/navigation";
import { CatalogListing } from "@/components/templates/catalog-listing";
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from "@/lib/get-catalog";
import { parseListingParams, type RawSearchParams } from "@/lib/catalog/listing-query";
import { listingMetadataInput } from "@/lib/catalog/seo";
import { buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<RawSearchParams> };

const TITLE = "Tienda de equipos de red";
const DESCRIPTION =
  "Routers industriales, gateways y equipos de networking con asesoría de HISTECH. Consulta especificaciones, disponibilidad y precio con un asesor.";

export async function generateMetadata({ searchParams }: Props) {
  const params = parseListingParams(await searchParams);
  return buildMetadata(listingMetadataInput({ basePath: "/tienda", title: TITLE, description: DESCRIPTION, params }));
}

export default async function StorePage({ searchParams }: Props) {
  const params = parseListingParams(await searchParams);
  const [result, categories, brands] = await Promise.all([
    getCatalogProducts({ q: params.q, brand: params.brand, page: params.page }),
    getCatalogCategories(),
    getCatalogBrands(),
  ]);

  // A page past the end is a dead link; an outage is not (it renders the friendly empty state).
  if (!result.unavailable && params.page > 1 && result.items.length === 0) notFound();

  return (
    <CatalogListing
      basePath="/tienda"
      title={TITLE}
      breadcrumbs={[
        { name: "Inicio", path: "/" },
        { name: "Tienda", path: "/tienda" },
      ]}
      params={params}
      result={result}
      categories={categories.items}
      brands={brands.items}
    />
  );
}
