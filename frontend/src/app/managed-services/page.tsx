import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["managed-services"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["servicios gestionados", "managed services", "monitoreo 24/7", "soporte IT", "helpdesk"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
