import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["ciberseguridad"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["ciberseguridad", "seguridad informática", "protección de datos", "SOC", "cumplimiento"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
