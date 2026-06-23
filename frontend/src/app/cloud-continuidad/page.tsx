import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["cloud-continuidad"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["cloud computing", "nube híbrida", "respaldo", "recuperación ante desastres", "alta disponibilidad"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
