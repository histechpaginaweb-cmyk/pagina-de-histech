import { notFound } from "next/navigation";
import { CatalogListing } from "@/components/templates/catalog-listing";
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from "@/lib/get-catalog";
import { parseListingParams, type RawSearchParams } from "@/lib/catalog/listing-query";
import { buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<RawSearchParams> };

export async function generateMetadata() {
  return buildMetadata({
    title: "Tienda de equipos de red",
    description:
      "Routers industriales, gateways y equipos de networking con asesoría de HISTECH. Consulta especificaciones, disponibilidad y precio con un asesor.",
    path: "/tienda",
  });
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
      title="Tienda de equipos de red"
      description="Equipos de conectividad y networking seleccionados por HISTECH. Cada producto cuenta con acompañamiento de un asesor para elegir, configurar e instalar."
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
