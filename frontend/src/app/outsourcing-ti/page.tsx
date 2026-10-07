import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["outsourcing-ti"];

export const metadata = buildMetadata({
  title: data.metaTitle ?? data.name,
  description: data.metaDescription ?? data.subtitle,
  path: `/${data.slug}`,
  keywords: ["outsourcing TI Colombia", "outsourcing de soporte técnico", "mesa de ayuda", "soporte por tickets", "tercerización de TI Bogotá"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
