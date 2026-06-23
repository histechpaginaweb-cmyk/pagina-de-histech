import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["computo"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["cómputo corporativo", "servidores", "estaciones de trabajo", "hardware empresarial"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
