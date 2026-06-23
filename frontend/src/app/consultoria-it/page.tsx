import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["consultoria-it"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["consultoría IT", "asesoría tecnológica", "CIO virtual", "estrategia tecnológica"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
