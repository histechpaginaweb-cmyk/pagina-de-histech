import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["inteligencia-artificial"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["inteligencia artificial empresarial", "agentes IA", "automatización", "RPA", "analítica"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
