import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["infraestructura-de-redes"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["infraestructura de redes", "networking", "conectividad", "zero-touch", "AI networking"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
