import { LocationPage } from "@/components/templates/location-page";
import { buildMetadata } from "@/lib/seo";
import { locationsContent } from "@/lib/locations-content";

const data = locationsContent["colombia"];

export const metadata = buildMetadata({
  title: "Soluciones Tecnológicas para Empresas en Colombia",
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: data.keywords,
});

export default function Page() {
  return <LocationPage data={data} />;
}
